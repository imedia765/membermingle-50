import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginTabs } from "@/components/auth/LoginTabs";
import { useLoginHandlers } from "@/components/auth/LoginHandlers";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleMemberIdSubmit } = useLoginHandlers((value) => {
    // This will be handled by the AuthStateHandler
    console.log("Login state updated:", value);
  });

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Email login implementation will be added later
    setIsLoading(false);
  };

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginTabs
            onEmailSubmit={handleEmailSubmit}
            onMemberIdSubmit={handleMemberIdSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
