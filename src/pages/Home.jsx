import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard';
import FlagFilter from '../components/FlagFilter';
import { useAuth } from '../contexts/AuthContext';

/**
 * Home page – list of posts with search, sort, and flag filter.
 */
const FLAG_OPTIONS = ['Announcement', 'Event', 'Question', 'Recommendation'];

export default function Home() {
  const { session, loading: authLoading } = useAuth();

  const [prefSort] = useState('created_at');
  const [sortKey, setSortKey]   = useState(prefSort);
  const [query,   setQuery]     = useState('');
  const [flag,    setFlag]      = useState(null);         // new
  const [posts,   setPosts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const [initialized, setInitialized] = useState(false);

  const abortRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*  Data fetching                                                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (authLoading) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current  = controller;

    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) controller.abort();
    }, 10_000);

    setLoading(true);
    setError(null);

    let queryBuilder = supabase
      .from('posts')
      .select('id, title, created_at, upvotes, flags')
      .ilike('title', `%${query}%`);

    if (flag) {
      queryBuilder = queryBuilder.contains('flags', [flag]);
    }

    queryBuilder
      .order(sortKey, { ascending: false })
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          console.error(error);
          setError(error.message);
          setPosts([]);
        } else {
          setPosts(data);
        }

        setLoading(false);
        setInitialized(true);
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        console.error(err);
        setError(err.message || 'Unexpected error');
        setPosts([]);
        setLoading(false);
        setInitialized(true);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
      setLoading(false);
    };
  }, [query, sortKey, flag, authLoading, session?.user?.id]);

  /* ------------------------------------------------------------------ */
  /*  UI helpers                                                         */
  /* ------------------------------------------------------------------ */

  const renderContent = () => {
    if (authLoading || (loading && !initialized)) return <Spinner />;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!posts.length) return <p>No posts found.</p>;

    return (
      <ul className="space-y-3">
        {posts.map(p => (
          <li key={p.id}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* Search & sort */}
      <div className="flex gap-3 items-center mb-4 flex-wrap">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search title..."
          className="input flex-1 min-w-[12rem]"
        />

        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          className="select"
          disabled={authLoading || (loading && !initialized)}
        >
          <option value="created_at">Newest</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </div>

      {/* Flag filter */}
      <FlagFilter
        flags={FLAG_OPTIONS}
        activeFlag={flag}
        onChange={setFlag}
      />

      {renderContent()}
    </>
  );
}