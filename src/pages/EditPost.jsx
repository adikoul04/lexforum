import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users
  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (!error) setPost(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return null;
  if (!post) return <Navigate to="/not-found" replace />;

  // Prevent editing someone else's post
  if (user.id !== post.author_id) return <Navigate to={`/post/${id}`} replace />;

  const handleSave = async updates => {
    const { error } = await supabase.from('posts').update(updates).eq('id', id);
    if (error) return alert(error.message);
    navigate(`/post/${id}`);
  };

  return (
    <>
      <Link to={`/post/${id}`} className="back-button">← Back to Post</Link>
      <h1 className="text-2xl mb-4">Edit Post</h1>
      <PostForm initial={post} onSave={handleSave} />
    </>
  );
}
