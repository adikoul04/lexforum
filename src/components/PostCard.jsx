import { Link } from 'react-router-dom';
export default function PostCard({ post }) {
  return (
    <article className="border rounded-xl p-4 space-y-2 shadow hover:shadow-lg">
      <h2 className="text-xl font-semibold">
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h2>
      <div className="text-sm opacity-70 flex items-center gap-2">
        <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time> •
        <span>{post.upvotes} upvotes</span>
      </div>
    </article>
  );
}