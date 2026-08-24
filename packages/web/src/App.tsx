import { FormEvent, useState } from 'react';
import { useAuthStore } from './store/authStore';

const App = () => {
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch (err) {
      setError('Unable to log in. Please check your email and password.');
    }
  };

  if (isAuthenticated && user) {
    return (
      <main className="app-content">
        <section className="welcome-card">
          <p className="eyebrow">TASKFLOW</p>
          <h1>Welcome, {user.name}!</h1>
          <p>You are successfully logged in.</p>

          <button type="button" onClick={logout}>
            Log out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-content">
      <section className="welcome-card">
        <p className="eyebrow">TASKFLOW</p>

        <h1>Welcome back</h1>

        <p>Sign in to continue to your workspace.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default App;