import { Link } from 'react-router-dom';

export default function PostNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-lex-navy text-lex-white">
      <h1 className="text-4xl font-bold">Post not found</h1>
      <Link to="/" className="px-4 py-2 rounded bg-lex-gold text-lex-navy font-medium">Back to Home</Link>
    </div>
  );
}
