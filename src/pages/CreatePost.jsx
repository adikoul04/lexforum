import { useNavigate, Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user }  = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const handleSave = async input => {
    const { data, error } = await supabase
      .from('posts')
      .insert({ ...input, author_id: user.id, upvotes: 0 })
      .select('id')
      .single();

    if (error) return alert(error.message);
    navigate(`/post/${data.id}`);
  };

  return (
    <>
      <Link to="/" className="back-button">← Back to Home</Link>
      <h1 className="text-2xl mb-4">New Post</h1>
      <PostForm onSave={handleSave} />
    </>
  );
}
