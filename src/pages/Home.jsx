import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { session, loading: authLoading } = useAuth();

  const [prefSort] = useState('created_at');
  const [sortKey, setSortKey]   = useState(prefSort);
  const [query,   setQuery]     = useState('');
  const [posts,   setPosts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const [initialized, setInitialized] = useState(false);

  /* Keep only the latest request alive */
  const abortRef = useRef(null);

  useEffect(() => {
    // Wait until auth layer finishes *and* re-run when the session changes
    if (authLoading) return;

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current  = controller;

    // Fallback: abort after 10 s if Supabase hangs
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) controller.abort();
    }, 10_000);

    setLoading(true);
    setError(null);

    supabase
      .from('posts')
      .select('id, title, created_at, upvotes')
      .ilike('title', `%${query}%`)
      .order(sortKey, { ascending: false })
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;   // request was cancelled

        if (error) {
          console.error(error);
          setError(error.message || 'Unexpected error');
          setPosts([]);
        } else {
          setPosts(data || []);
        }
        setLoading(false);
        setInitialized(true);
      })
      .catch(err => {
        // Treat AbortError as a normal, successful cancellation
        if (err.name === 'AbortError') {
          setLoading(false);
          return;
        }

        if (!controller.signal.aborted) {
          console.error(err);
          setError(err.message || 'Unexpected error');
          setPosts([]);
          setLoading(false);
          setInitialized(true);
        }
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
      /* Make sure we don’t leave the spinner up after an abort */
      setLoading(false);
    };
    // Re-run when query, sortKey, auth readiness, *or session* changes.
  }, [query, sortKey, authLoading, session?.user?.id]);

  /* ------------------------------------------------------------------ */
  /*  UI helpers                                                         */
  /* ------------------------------------------------------------------ */

  const handleSortChange = e => {
    const v = e.target.value;
    setSortKey(v);
    };

  const renderContent = () => {
    if (authLoading || (loading && !initialized)) return <Spinner />;

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
      <section className="space-y-4">
        {posts.length === 0
          ? <div className="text-gray-500">No posts found</div>
          : posts.map(p => <PostCard key={p.id} post={p} />)
        }
      </section>
    );
  };

  return (
    <>
      <div className="flex gap-2 my-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search title…"
          className="input flex-1"
          disabled={authLoading || (loading && !initialized)}
        />
        <select
          value={sortKey}
          onChange={handleSortChange}
          className="select"
          disabled={authLoading || (loading && !initialized)}
        >
          <option value="created_at">Newest</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </div>

      {renderContent()}
    </>
  );
}