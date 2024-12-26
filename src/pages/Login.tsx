import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoginTabs } from "@/components/auth/LoginTabs";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Email login error:", error);
        throw error;
      }

      if (data?.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/admin/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberIdLogin = async (memberId: string, password: string) => {
    setIsLoading(true);
    const cleanMemberId = memberId.toUpperCase().trim();
    
    try {
      // First check if member exists
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('id, email, auth_user_id, password_changed')
        .eq('member_number', cleanMemberId)
        .maybeSingle();

      if (memberError) {
        console.error("Member lookup error:", memberError);
        throw new Error("Error checking member status");
      }

      if (!member) {
        throw new Error("Invalid Member ID. Please check your credentials.");
      }

      // Use temporary email format for initial login
      const tempEmail = `${cleanMemberId.toLowerCase()}@temp.pwaburton.org`;
      console.log("Attempting login with:", { tempEmail, memberId: cleanMemberId });

      // Try to sign in first
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: password,
      });

      // If sign in fails, try to sign up
      if (signInError) {
        console.log("Sign in failed, attempting signup");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: tempEmail,
          password: password,
        });

        if (signUpError) {
          console.error("Signup error:", signUpError);
          throw new Error("Authentication failed. Please check your credentials.");
        }

        // Update member with auth user id if signup successful
        if (signUpData.user) {
          const { error: updateError } = await supabase
            .from('members')
            .update({ 
              auth_user_id: signUpData.user.id,
              email_verified: true,
              profile_updated: true
            })
            .eq('id', member.id);

          if (updateError) {
            console.error("Error updating member:", updateError);
          }
        }
      }

      // Check if password needs to be changed
      if (!member.password_changed) {
        navigate("/change-password");
        return;
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/admin/profile");
    } catch (error) {
      console.error("Member ID login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginTabs 
            onEmailSubmit={handleEmailLogin}
            onMemberIdSubmit={handleMemberIdLogin}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}