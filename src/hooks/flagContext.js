import { useState, useContext, createContext, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const FlagContext = createContext()

export const FlagProvider = ({children}) => {
    const [foundFlags, setFoundFlags] = useState([])
    const [userId, setUserId] = useState(null)
    
    // Get the current user on mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
                // Get previously found flags from DB
                fetchUserFlags(session.user.id);
            }
        };
        
        getUser();
        
        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUserId(session.user.id);
                fetchUserFlags(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setUserId(null);
                setFoundFlags([]);
            }
        });
        
        return () => {
            listener?.subscription?.unsubscribe();
        };
    }, []);
    
    // Fetch flags from Supabase
    const fetchUserFlags = async (uid) => {
        const { data, error } = await supabase
            .from('user_flags')
            .select('flag_id')
            .eq('user_id', uid);
            
        if (!error && data) {
            // Extract flag_ids from the data
            const flags = data.map(item => item.flag_id);
            setFoundFlags(flags);
        }
    };

    const addFlag = async (id) => {
        // Check if the flag is already found
        if (!foundFlags.includes(id)) {
            // Update local state
            setFoundFlags(prev => [...prev, id]);
            
            // If user is logged in, save to database
            if (userId) {
                try {
                    const { error } = await supabase
                        .from('user_flags')
                        .insert([
                            { user_id: userId, flag_id: id, captured_at: new Date().toISOString() }
                        ]);
                        
                    if (error) {
                        console.error("Error saving flag:", error);
                    }
                } catch (err) {
                    console.error("Error in addFlag:", err);
                }
            }
            return true;
        }
        return false;
    }
 
    return(
        <FlagContext.Provider value={{foundFlags, addFlag}}>
            {children}
        </FlagContext.Provider>
    )
}

export const UseFlag = () => useContext(FlagContext)
