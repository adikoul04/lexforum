import { useState, useEffect } from 'react';

export default function Spinner() {
  // Show message only after 5 s
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowMessage(true), 5000);
    return () => clearTimeout(t);               // clean-up if component unmounts
  }, []);

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      {/* spinning circle */}
      <svg
        className="size-10 animate-spin text-lex-gold"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      {/* message appears only after delay */}
      {showMessage && (
        <p className="text-sm text-lex-gold text-center max-w-xs px-4">
          If this loading is taking abnormally long, feel free to reload the
          page — Supabase is sometimes a bit finicky.
        </p>
      )}
    </div>
  );
}
