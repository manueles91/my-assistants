import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const useAuthState = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // If user is authenticated and trying to access auth page, redirect to home
        if (session && location.pathname === '/auth') {
          navigate('/');
        }
        // If user is not authenticated and trying to access protected routes
        else if (!session && location.pathname !== '/auth') {
          navigate('/auth');
        }
      } catch (error) {
        const authError = error as AuthError;
        console.error('Session check error:', authError.message);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      switch (event) {
        case "SIGNED_IN":
          navigate('/');
          break;
        case "SIGNED_OUT":
          navigate('/auth');
          break;
        case "USER_UPDATED":
          if (session) {
            toast({
              title: "Profile Updated",
              description: "Your profile has been updated successfully.",
            });
          }
          break;
        case "PASSWORD_RECOVERY":
          toast({
            title: "Password Recovery",
            description: "Please check your email for password reset instructions.",
          });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);
};