import { useState } from 'react';

/**
 * Simple post form used for both create & edit views.
 * Fields: title (required), content, image URL.
 * Returns an object { title, content, image_url } to the caller.
 */
export default function PostForm({ initial = {}, onSave }) {
  const [title,     setTitle]     = useState(initial.title      ?? '');
  const [content,   setContent]   = useState(initial.content    ?? '');
  const [imageUrl,  setImageUrl]  = useState(initial.image_url  ?? '');

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ title, content, image_url: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span>Title *</span>
        <input
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input w-full"
        />
      </label>

      <label className="block">
        <span>Content</span>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="textarea w-full"
          rows={6}
        />
      </label>

      <label className="block">
        <span>Image URL</span>
        <input
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          className="input w-full"
        />
      </label>

      <button className="btn bg-lex-gold text-lex-white px-3 py-1 rounded">
        Save
      </button>
    </form>
  );
}
