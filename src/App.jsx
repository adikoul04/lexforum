import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Target path for the New Post button
  const newPostHref = user ? '/new' : '/login';

  return (
    <div className="max-w-3xl mx-auto p-4 bg-lex-white text-lex-navy rounded-xl shadow-lg">
      <header className="flex items-center justify-between mb-6 /* 👈 keep old spacing */">
        {/* ── Logo + motto ── */}
        <div className="flex items-center gap-3">
          {/* 1️⃣  Bigger logo + negative margin pulls it out of the flow */}
          <Link to="/" className="-my-5 shrink-0">      {/* -my-2 ≈ -0.5 rem top & bottom */}
            <img
              src="/lexforum-logo.png"
              alt="LexForum"
              className="h-20 w-auto sm:h-28 lg:h-32"  /* up from h-20 */
            />
          </Link>

          {/* 2️⃣  Motto (unchanged) */}
          <span className="hidden sm:inline text-md leading-tight font-medium text-lex-navy">
            The place to be for all things Lexington!
          </span>
        </div>

        {/* ── Buttons (unchanged) ── */}
        <div className="flex items-center gap-3">
          <Link
            to={newPostHref}
            className="bg-lex-gold text-lex-navy px-3 py-1 rounded"
          >
            New&nbsp;Post
          </Link>

          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }}
              className="bg-lex-gold text-lex-navy px-3 py-1 rounded"
            >
              Sign&nbsp;out
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-lex-gold text-lex-navy px-3 py-1 rounded"
            >
              Sign&nbsp;in
            </Link>
          )}
        </div>
      </header>


      <Outlet />
    </div>
  );
}
