import { supabase } from "@/lib/supabaseClient";


export async function signUpUser(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      // remove
      console.log("Supabase signUp result:", { data, error });

    return {data, error};
}

export async function signInUser(email, password) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    return {data, error};
}

export async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

