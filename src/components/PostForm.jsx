import { useState } from 'react';

const FLAG_OPTIONS = ['Announcement', 'Event', 'Question', 'Recommendation'];

/**
 * Post form used for both create & edit views.
 * Fields: title (required), content, image URL, flags.
 * Returns object { title, content, image_url, flags } to the caller.
 */
export default function PostForm({ initial = {}, onSave }) {
  const [title,     setTitle]     = useState(initial.title      ?? '');
  const [content,   setContent]   = useState(initial.content    ?? '');
  const [imageUrl,  setImageUrl]  = useState(initial.image_url  ?? '');
  const [flags,     setFlags]     = useState(initial.flags      ?? []);

  const toggleFlag = flag => {
    setFlags(prev =>
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    onSave({ title, content, image_url: imageUrl, flags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block space-y-1">
        <span>Title <span className="text-red-600">*</span></span>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input w-full"
          required
        />
      </label>

      <label className="block space-y-1">
        <span>Content</span>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="input w-full h-32 resize-y"
        />
      </label>

      <label className="block space-y-1">
        <span>Image URL</span>
        <input
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          className="input w-full"
        />
      </label>

      <fieldset>
        <legend className="font-medium mb-2">Flags</legend>
        <div className="flex flex-wrap gap-3">
          {FLAG_OPTIONS.map(flag => (
            <label key={flag} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={() => toggleFlag(flag)}
                className="checkbox"
              />
              <span>{flag}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className="btn bg-lex-gold text-lex-white px-3 py-1 rounded">
        Save
      </button>
    </form>
  );
}