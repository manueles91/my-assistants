import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthChangeEvent } from "@supabase/supabase-js";

export const AuthForm = () => {
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "USER_DELETED") {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
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
      redirectTo={window.location.origin}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email address',
            password_label: 'Password',
            button_label: 'Sign in',
            loading_button_label: 'Signing in...',
            email_input_placeholder: 'Your email address',
            password_input_placeholder: 'Your password',
            link_text: 'Already have an account? Sign in',
          },
          sign_up: {
            email_label: 'Email address',
            password_label: 'Create a password (minimum 6 characters)',
            button_label: 'Sign up',
            loading_button_label: 'Creating account...',
            email_input_placeholder: 'Your email address',
            password_input_placeholder: 'Your password',
            link_text: "Don't have an account? Sign up",
          },
          forgotten_password: {
            link_text: 'Forgot password?',
            button_label: 'Send reset instructions',
            loading_button_label: 'Sending reset instructions...',
            confirmation_text: 'Check your email for the password reset link',
          },
        },
      }}
      theme="light"
    />
  );
};