import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import CreateProjectForm from './CreateProjectForm';

const ProjectList = () => {
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspace
  );

  const projects = useProjectStore((state) => state.projects);
  const currentProject = useProjectStore(
    (state) => state.currentProject
  );
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);
  const fetchProjects = useProjectStore(
    (state) => state.fetchProjects
  );
  const setCurrentProject = useProjectStore(
    (state) => state.setCurrentProject
  );

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!currentWorkspace) {
      return;
    }

    fetchProjects(currentWorkspace.id).catch(() => {
      // Store handles the error state.
    });
  }, [currentWorkspace, fetchProjects]);

  if (!currentWorkspace) {
    return (
      <section>
        <h2>Projects</h2>
        <p>Select a workspace to view its projects.</p>
      </section>
    );
  }

  if (isLoading && projects.length === 0) {
    return <p>Loading projects...</p>;
  }

  return (
    <section>
      <div>
        <h2>Projects</h2>
        <p>{currentWorkspace.name}</p>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
        >
          New Project
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {projects.length === 0 ? (
        <p>This workspace doesn't have any projects yet.</p>
      ) : (
        <div>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setCurrentProject(project)}
            >
              <div>
                <strong>{project.name}</strong>
              </div>

              <div>
                <span>{project.slug}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {currentProject && (
        <div>
          <h3>{currentProject.name}</h3>

          <p>
            {currentProject.description ||
              'No description provided.'}
          </p>
        </div>
      )}

      {showCreateForm && (
        <CreateProjectForm
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </section>
  );
};

export default ProjectList;