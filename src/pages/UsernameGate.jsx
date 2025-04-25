import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function UsernameGate() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    const { error } = await supabase.from('profiles').insert({ id: user.id, username });
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Choose a username</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="border px-3 py-1 rounded"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-lex-gold text-lex-white px-3 py-1 rounded">Save</button>
      </form>
    </div>
  );
}
