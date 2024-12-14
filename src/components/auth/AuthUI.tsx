import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthUI = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_up");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        console.log("Signed in:", session);
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        console.log("Signed out");
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery requested");
      } else if (event === "INITIAL_SESSION") {
        console.log("Initial session");
        if (session) navigate("/");
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed");
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
      }

      // Handle invalid credentials error from response
      const error = session as any;
      if (error?.error?.message === "Invalid login credentials") {
        toast({
          title: "Authentication Error",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const handleAuthError = (error: Error) => {
    console.error("Auth error:", error);
    
    try {
      // Try to parse the error message if it's a stringified JSON
      const errorBody = JSON.parse(error.message);
      if (errorBody.code === "user_already_exists") {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
        });
        setView("sign_in");
        return;
      }
    } catch (e) {
      // If error message isn't JSON or doesn't match expected format,
      // show a generic error message
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Welcome</h2>
      <p className="text-center text-muted-foreground mb-6">
        Create an account or sign in to continue
      </p>
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#000000',
                brandAccent: '#333333',
              },
            },
          },
        }}
        providers={[]}
        view={view}
        theme="light"
        redirectTo={window.location.origin}
        onlyThirdPartyProviders={false}
        showLinks={true}
        onError={handleAuthError}
      />
    </div>
  );
};

export default AuthUI;