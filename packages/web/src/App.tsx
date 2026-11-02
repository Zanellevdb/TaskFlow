import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import WorkspaceList from './components/WorkspaceList';
import CreateWorkspaceForm from './components/CreateWorkspaceForm';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';

const App = () => {
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const fetchCurrentUser = useAuthStore(
    (state) => state.fetchCurrentUser
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCreateWorkspace, setShowCreateWorkspace] =
    useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setIsInitializing(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch {
        localStorage.removeItem('accessToken');
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, [fetchCurrentUser]);

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch {
      setError(
        'Unable to log in. Please check your email and password.'
      );
    }
  };

  if (isInitializing) {
    return (
      <main className="app-content">
        <section className="welcome-card">
          <p className="eyebrow">TASKFLOW</p>
          <p>Loading your workspace...</p>
        </section>
      </main>
    );
  }

  if (isAuthenticated && user) {
    return (
      <main className="app-content">
        <section className="welcome-card">
          <p className="eyebrow">TASKFLOW</p>

          <div>
            <h1>Welcome, {user.name}!</h1>
            <p>{user.email}</p>
          </div>

          <button type="button" onClick={logout}>
            Log out
          </button>
        </section>

        <section className="welcome-card">
          <WorkspaceList />

          {showCreateWorkspace && (
            <CreateWorkspaceForm
              onClose={() => setShowCreateWorkspace(false)}
            />
          )}

          {!showCreateWorkspace && (
            <button
              type="button"
              onClick={() => setShowCreateWorkspace(true)}
            >
              Create Workspace
            </button>
          )}
        </section>

        <section className="welcome-card">
          <ProjectList />
        </section>

        <section className="welcome-card">
          <TaskList />
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