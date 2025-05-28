import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="border border-lex-navy/10 bg-white rounded-xl p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-lex-navy">
        <Link to={`/post/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* Flag chips */}
      {post.flags?.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {post.flags.map(flag => (
            <li
              key={flag}
              className="text-xs font-medium bg-lex-navy/10 text-lex-navy px-2 py-0.5 rounded-full"
            >
              {flag}
            </li>
          ))}
        </ul>
      )}

      <div className="text-sm opacity-70 flex items-center gap-2">
        <time dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleString()}
        </time>
        •
        <span>{post.upvotes} upvotes</span>
      </div>
    </article>
  );
}