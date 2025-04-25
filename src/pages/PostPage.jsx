import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost]               = useState(null);
  const [comments, setComments]       = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);

  /* inline messages */
  const [needSignInMsg, setNeedSignInMsg]         = useState(false);
  const [needCommentSignInMsg, setNeedCommentMsg] = useState(false);

  const [imageError, setImageError] = useState(false);

  /* fetch post + comments */
  useEffect(() => {
    (async () => {
      const { data: postData, error } = await supabase
        .from('posts')
        .select('*, author:profiles(username)')
        .eq('id', id)
        .single();

      if (error) {
        setNotFound(true);
        return;
      }

      const { data: comm } = await supabase
        .from('comments')
        .select('*, author:profiles(username)')
        .eq('post_id', id)
        .order('created_at');

      setPost(postData);
      setComments(comm ?? []);
      setLoading(false);
    })();
  }, [id]);

  const isGuest = !user;

  /* === UPVOTE === */
  const upvote = async () => {
    if (isGuest) {
      setNeedSignInMsg(true);
      return;
    }

    const { error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);

    if (error) return alert(error.message);
    setPost(p => ({ ...p, upvotes: p.upvotes + 1 }));
  };

  /* === COMMENT === */
  const sendComment = async () => {
    if (isGuest) {
      setNeedCommentMsg(true);
      return;
    }
    if (!commentText) return;

    const { error } = await supabase
      .from('comments')
      .insert({ post_id: id, author_id: user.id, content: commentText });

    if (error) return alert(error.message);

    setCommentText('');
    const { data: comm } = await supabase
      .from('comments')
      .select('*, author:profiles(username)')
      .eq('post_id', id)
      .order('created_at');

    setComments(comm ?? []);
  };

  /* === DELETE POST === */
  const remove = async () => {
    // RLS ensures only author can delete
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) navigate('/');
  };

  const canEdit = user && user.id === post?.author_id;

  if (loading) return <Spinner />;
  if (notFound) return <Navigate to="/not-found" replace />;

  return (
    <>
      <Link to="/" className="back-button">← Back to Home</Link>

      {/* -------------- POST HEADER -------------- */}
      <article className="my-4 space-y-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="text-sm opacity-70 flex gap-2 items-center">
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleString()}
          </time>
          • <span>by {post.author?.username ?? 'Unknown'}</span>
          • <span>{post.upvotes} upvotes</span>
        </div>

        {post.show_image && post.image_url && !imageError && (
          <img
            src={post.image_url}
            alt=""
            onError={() => setImageError(true)}
            className="max-h-96 w-full object-cover rounded"
          />
        )}

        <p>{post.content}</p>
      </article>

      {/* -------------- ACTION BUTTONS -------------- */}
      <div className="flex gap-2 mb-4">
        {/* Upvote */}
        <button
          type="button"
          onClick={upvote}
          className={`
            inline-flex items-center rounded px-3 py-1 font-medium transition
            bg-lex-gold text-lex-white hover:bg-lex-navy hover:text-lex-gold
            ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          Upvote
        </button>

        {/* Edit / Delete for authors */}
        {canEdit && (
          <>
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="inline-flex items-center rounded px-3 py-1 font-medium
                         bg-lex-gold text-lex-white hover:bg-lex-navy hover:text-lex-gold"
            >
              Edit
            </button>

            <button
              onClick={remove}
              className="inline-flex items-center rounded px-3 py-1 font-medium
                         bg-lex-gold text-lex-white hover:bg-lex-navy hover:text-lex-gold"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Sign-in notice for up-votes */}
      {needSignInMsg && (
        <p className="text-red-500 text-sm mb-4">
          Please sign in to up-vote posts.
        </p>
      )}

      {/* -------------- COMMENTS -------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>

        {comments.map(c => (
          <div key={c.id} className="border rounded px-3 py-2">
            <p className="text-sm opacity-70">
              {c.author?.username ?? 'Unknown'} •{' '}
              {new Date(c.created_at).toLocaleString()}
            </p>
            <p>{c.content}</p>
            {user && user.id === c.author_id && (
              <button
                className="text-sm text-lex-white mt-1"
                onClick={async () => {
                  const { error } = await supabase
                    .from('comments')
                    .delete()
                    .eq('id', c.id);
                  if (!error) setComments(s => s.filter(x => x.id !== c.id));
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {/* Write a comment */}
        <div className="mt-4 flex flex-col gap-2">
          <textarea
            className="border rounded p-2 min-h-[80px]"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder={user ? 'Add a comment…' : 'Sign in to comment'}
          />
          <button
            onClick={sendComment}
            disabled={!commentText}
            className="rounded px-3 py-1 font-medium
                       bg-lex-gold text-lex-white disabled:opacity-50
                       hover:bg-lex-navy hover:text-lex-gold"
          >
            Send
          </button>

          {/* Sign-in notice for comments */}
          {needCommentSignInMsg && (
            <p className="text-red-500 text-sm">
              Please sign in to leave a comment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
