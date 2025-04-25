import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);

  /* Redirect only after the component mounts */
  useEffect(() => {
    if (session) navigate('/');
  }, [session, navigate]);

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */

  const handleSubmit = async e => {
    e.preventDefault();

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) return setError(err.message);

    // AuthContext will pick up the new session and trigger the redirect
    setError(null);
  };

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Sign in</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-72">
        <input
          className="border px-3 py-1 rounded"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border px-3 py-1 rounded"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="bg-lex-gold text-lex-white rounded px-3 py-1">
          Continue
        </button>
      </form>

      {/* Navigation links */}
      <Link className="text-sm underline" to="/signup">
        Create an account
      </Link>
      <Link className="text-sm underline" to="/">
        ← Back
      </Link>
    </div>
  );
}