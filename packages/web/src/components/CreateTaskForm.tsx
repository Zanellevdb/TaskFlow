import { FormEvent, useState } from 'react';
import {
  type TaskPriority,
  type TaskStatus,
} from '../api/task';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { useWorkspaceStore } from '../store/workspaceStore';

interface CreateTaskFormProps {
  onClose: () => void;
}

const CreateTaskForm = ({
  onClose,
}: CreateTaskFormProps) => {
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspace
  );

  const projects = useProjectStore(
    (state) => state.projects
  );

  const createTask = useTaskStore(
    (state) => state.createTask
  );

  const isLoading = useTaskStore(
    (state) => state.isLoading
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] =
    useState<TaskStatus>('TODO');
  const [priority, setPriority] =
    useState<TaskPriority>('MEDIUM');
  const [projectId, setProjectId] = useState(
    projects[0]?.id ?? ''
  );
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

    if (!projectId) {
      setError('Please select a project first.');
      return;
    }

    try {
      await createTask(currentWorkspace.id, {
        title,
        description: description || undefined,
        status,
        priority,
        projectId,
      });

      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      onClose();
    } catch {
      setError('Unable to create task.');
    }
  };

  if (!currentWorkspace) {
    return null;
  }

  if (projects.length === 0) {
    return (
      <div>
        <h3>Create Task</h3>
        <p>
          Create a project before creating a task.
        </p>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Task</h3>

      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        minLength={2}
        maxLength={200}
        required
      />

      <label htmlFor="task-description">
        Description
      </label>

      <textarea
        id="task-description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        maxLength={2000}
      />

      <label htmlFor="task-status">Status</label>

      <select
        id="task-status"
        value={status}
        onChange={(event) =>
          setStatus(event.target.value as TaskStatus)
        }
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <label htmlFor="task-priority">Priority</label>

      <select
        id="task-priority"
        value={priority}
        onChange={(event) =>
          setPriority(
            event.target.value as TaskPriority
          )
        }
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <label htmlFor="task-project">Project</label>

      <select
        id="task-project"
        value={projectId}
        onChange={(event) =>
          setProjectId(event.target.value)
        }
        required
      >
        <option value="" disabled>
          Select a project
        </option>

        {projects.map((project) => (
          <option
            key={project.id}
            value={project.id}
          >
            {project.name}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Task'}
      </button>

      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default CreateTaskForm;