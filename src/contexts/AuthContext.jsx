import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * AuthContext – provides { user, session, loading } and
 * guarantees that each logged-in user has a row in `profiles`.
 * A 5 s watch-dog makes sure we never hang on a broken refresh token.
 */
const AuthContext = createContext({ user: null, session: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */

  const ensureProfile = async user => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!data && error?.code === 'PGRST116') {
      await supabase.from('profiles').insert({
        id: user.id,
        username: user.email.split('@')[0],   // simple fallback
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Main effect – initial session, auth events, watch-dog timer       */
  /* ------------------------------------------------------------------ */

  const loadingRef = useRef(true);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    let cancelled = false;

    /* 1. Initial session (may trigger an automatic token refresh) ----- */
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setSession(session);
      setLoading(false);
      ensureProfile(session?.user);
    });

    /* 2. Auth-event subscription ------------------------------------- */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, nextSession) => {
        if (event === 'TOKEN_REFRESH_FAILED') {
          console.warn('TOKEN_REFRESH_FAILED – forcing sign-out');
          await supabase.auth.signOut({ scope: 'local' }); // nuke local tokens
          setSession(null);                                // update UI NOW
          setLoading(false);
          return;
        }
        setSession(nextSession);
        await ensureProfile(nextSession?.user);
      }
    );

    /* 3. 5-second watch-dog ------------------------------------------ */
    const watchdogId = setTimeout(async () => {
      if (loadingRef.current) {
        console.warn('Auth watch-dog: refresh hung – forcing sign-out');
        await supabase.auth.signOut({ scope: 'local' });   // clear storage
        setSession(null);                                  // unblock UI
        setLoading(false);
      }
    }, 5000);

    /* 4. Cleanup ------------------------------------------------------ */
    return () => {
      cancelled = true;
      clearTimeout(watchdogId);
      subscription?.unsubscribe();
    };
  }, []);

  const value = { session, user: session?.user ?? null, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
