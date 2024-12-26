import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanMemberId = memberId.toUpperCase().trim();
    
    try {
      console.log("Starting login process for member:", cleanMemberId);
      
      // First check if member exists
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('id, email, member_number')
        .eq('member_number', cleanMemberId)
        .maybeSingle();

      if (memberError) {
        console.error("Member lookup error:", memberError);
        throw new Error("Error checking member status");
      }

      if (!member) {
        throw new Error("Invalid Member ID. Please check your credentials.");
      }

      // Clear any existing sessions
      await supabase.auth.signOut();

      // Generate temp email for authentication
      const tempEmail = `${cleanMemberId.toLowerCase()}@temp.pwaburton.org`;
      console.log("Attempting authentication with:", tempEmail);

      // Attempt sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: password,
      });

      if (signInError) {
        console.error("Authentication error:", signInError);
        
        // For first-time users, attempt signup
        if (signInError.message.includes('Invalid login credentials')) {
          console.log("First time login, attempting signup");
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: tempEmail,
            password: password,
          });

          if (signUpError) {
            console.error("Signup error:", signUpError);
            throw new Error("Failed to create account. Please try again.");
          }

          if (!signUpData.user) {
            throw new Error("Account creation failed. Please try again.");
          }

          // Update member record
          const { error: updateError } = await supabase
            .from('members')
            .update({
              email_verified: true,
              first_time_login: true,
            })
            .eq('id', member.id);

          if (updateError) {
            console.error("Member update error:", updateError);
            throw new Error("Failed to update member status");
          }
        } else {
          throw new Error("Invalid credentials. Please try again.");
        }
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate("/admin/profile");
    } catch (error) {
      console.error("Login process failed:", error);
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
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700">
              Enter your Member ID and password to login. For new members,
              use your Member ID as both username and password.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="memberId"
                name="memberId"
                type="text"
                placeholder="Member ID (e.g. TM20001)"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                required
                disabled={isLoading}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}