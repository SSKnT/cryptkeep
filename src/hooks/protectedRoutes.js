import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export function useProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth"); // or wherever your login page is
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  return { loading };
}
