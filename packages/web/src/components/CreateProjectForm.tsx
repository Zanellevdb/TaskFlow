import { FormEvent, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useWorkspaceStore } from '../store/workspaceStore';

interface CreateProjectFormProps {
  onClose: () => void;
}

const CreateProjectForm = ({
  onClose,
}: CreateProjectFormProps) => {
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspace
  );

  const createProject = useProjectStore(
    (state) => state.createProject
  );

  const isLoading = useProjectStore(
    (state) => state.isLoading
  );

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');

    if (!currentWorkspace) {
      setError('Please select a workspace first.');
      return;
    }

    try {
      await createProject(currentWorkspace.id, {
        name,
        slug,
        description: description || undefined,
      });

      setName('');
      setSlug('');
      setDescription('');
      onClose();
    } catch {
      setError('Unable to create project.');
    }
  };

  if (!currentWorkspace) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Project</h3>

      <label htmlFor="project-name">Name</label>
      <input
        id="project-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        minLength={2}
        maxLength={100}
        required
      />

      <label htmlFor="project-slug">Slug</label>
      <input
        id="project-slug"
        type="text"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        minLength={2}
        maxLength={50}
        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
        required
      />

      <label htmlFor="project-description">
        Description
      </label>

      <textarea
        id="project-description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        maxLength={500}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Project'}
      </button>

      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default CreateProjectForm;