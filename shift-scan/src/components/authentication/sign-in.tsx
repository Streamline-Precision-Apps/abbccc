'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      employee_username: username,
      password,
    });

    if (result?.error || result === undefined) {
      console.error(result?.error);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Password
        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}
export default SignIn;