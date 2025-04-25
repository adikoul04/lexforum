import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [emailSent, setEmailSent] = useState(false);   // ← NEW

  /* ------------------------------------------------------------------ */
  /*  Submit                                                            */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async e => {
    e.preventDefault();
    const { error: err } = await supabase.auth.signUp({ email, password });

    if (err) return setError(err.message);

    // Supabase has queued a confirmation email
    setError(null);
    setEmailSent(true);
  };

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">

      {/* ──────────────────────  Success notice  ────────────────────── */}
      {emailSent ? (
        <>
          <h1 className="text-2xl font-bold">Almost there!</h1>
          <p className="text-center max-w-sm">
            We just sent a confirmation link to&nbsp;
            <span className="font-medium">{email}</span>. <br />
            Click that link to verify your account, then come back here to sign in.
          </p>
          <Link className="underline text-sm" to="/login">
            Back to sign-in
          </Link>
        </>
      ) : (
      /* ──────────────────────  Sign-up form  ────────────────────── */
        <>
          <h1 className="text-2xl font-bold">Create an account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-72">
            <input
              className="border rounded px-3 py-1"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="border rounded px-3 py-1"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="bg-lex-gold text-lex-white rounded px-3 py-1">
              Sign up
            </button>
          </form>

          <Link className="text-sm underline" to="/login">
            Already have an account? Sign in
          </Link>
        </>
      )}
    </div>
  );
}
