import { FormEvent, useState } from 'react';
import {
  useWorkspaceStore,
} from '../store/workspaceStore';

interface CreateWorkspaceFormProps {
  onClose: () => void;
}

const CreateWorkspaceForm = ({
  onClose,
}: CreateWorkspaceFormProps) => {
  const createWorkspace = useWorkspaceStore(
    (state) => state.createWorkspace
  );
  const isLoading = useWorkspaceStore(
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

    try {
      await createWorkspace({
        name,
        slug,
        description: description || undefined,
      });

      onClose();
    } catch {
      setError('Unable to create workspace.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Workspace</h3>

      <label htmlFor="workspace-name">Name</label>
      <input
        id="workspace-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        minLength={2}
        maxLength={100}
        required
      />

      <label htmlFor="workspace-slug">Slug</label>
      <input
        id="workspace-slug"
        type="text"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        minLength={2}
        maxLength={50}
        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
        required
      />

      <label htmlFor="workspace-description">
        Description
      </label>
      <textarea
        id="workspace-description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        maxLength={500}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Workspace'}
      </button>

      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default CreateWorkspaceForm;