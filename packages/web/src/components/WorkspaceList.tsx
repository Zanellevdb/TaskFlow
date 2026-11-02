import { useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';

const WorkspaceList = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspace
  );
  const isLoading = useWorkspaceStore((state) => state.isLoading);
  const error = useWorkspaceStore((state) => state.error);
  const fetchWorkspaces = useWorkspaceStore(
    (state) => state.fetchWorkspaces
  );
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  useEffect(() => {
    fetchWorkspaces().catch(() => {
      // Store handles the error state.
    });
  }, [fetchWorkspaces]);

  if (isLoading && workspaces.length === 0) {
    return <p>Loading workspaces...</p>;
  }

  return (
    <section>
      <div>
        <h2>Your Workspaces</h2>

        <button type="button">
          New Workspace
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {workspaces.length === 0 ? (
        <p>You don't have any workspaces yet.</p>
      ) : (
        <div>
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              type="button"
              onClick={() => setCurrentWorkspace(workspace)}
            >
              <div>
                <strong>{workspace.name}</strong>
              </div>

              <div>
                <span>{workspace.slug}</span>
              </div>

              <div>
                <span>{workspace.role}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {currentWorkspace && (
        <div>
          <h3>{currentWorkspace.name}</h3>

          <p>
            {currentWorkspace.description ||
              'No description provided.'}
          </p>
        </div>
      )}
    </section>
  );
};

export default WorkspaceList;