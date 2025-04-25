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
      <header className="flex justify-between items-center mb-6">
        {/* Left – logo */}
        <Link to="/" className="text-2xl font-bold">LexForum</Link>

        {/* Right – action buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={newPostHref}
            className="bg-lex-gold text-lex-navy px-3 py-1 rounded"
          >
            New Post
          </Link>

          {user ? (
            <button
              onClick={signOut}
              className="bg-lex-gold text-lex-navy px-3 py-1 rounded"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-lex-gold text-lex-navy px-3 py-1 rounded"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  );
}
