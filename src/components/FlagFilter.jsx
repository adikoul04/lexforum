import React from 'react';

/**
 * Renders a row of toggle buttons for each flag category.
 * The active flag is highlighted. Passing null clears the filter.
 *
 * @param {string[]} flags             List of available flag strings.
 * @param {string|null} activeFlag     Currently‑selected flag filter.
 * @param {(flag:string|null)=>void} onChange Callback when a flag is toggled.
 */
export default function FlagFilter({ flags = [], activeFlag, onChange }) {
  const handleClick = flag => {
    if (activeFlag === flag) {
      onChange(null);       // clicking the same flag clears the filter
    } else {
      onChange(flag);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {flags.map(flag => (
        <button
          key={flag}
          onClick={() => handleClick(flag)}
          className={[
            'px-3 py-1 rounded-full border transition',
            activeFlag === flag
              ? 'bg-lex-gold text-lex-navy border-lex-gold'
              : 'bg-lex-white text-lex-navy border-lex-navy hover:bg-lex-gold/20'
          ].join(' ')}
        >
          {flag}
        </button>
      ))}

      {/* Clear button appears only when a flag is selected */}
      {activeFlag && (
        <button
          onClick={() => onChange(null)}
          className="px-3 py-1 rounded-full border bg-lex-white text-lex-navy border-lex-navy/50 hover:bg-red-50"
        >
          Clear
        </button>
      )}
    </div>
  );
}