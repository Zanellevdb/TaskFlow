import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import CreateTaskForm from './CreateTaskForm';

const TaskList = () => {
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspace
  );
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const setCurrentTask = useTaskStore(
    (state) => state.setCurrentTask
  );

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!currentWorkspace) {
      return;
    }

    fetchTasks(currentWorkspace.id).catch(() => {
      // Store handles the error state.
    });
  }, [currentWorkspace, fetchTasks]);

  const handleCreateFormClose = async () => {
    if (currentWorkspace) {
      try {
        await fetchTasks(currentWorkspace.id);
      } catch {
        // Store handles the error state.
      }
    }

    setShowCreateForm(false);
  };

  if (!currentWorkspace) {
    return (
      <section>
        <h2>Tasks</h2>
        <p>Select a workspace to view its tasks.</p>
      </section>
    );
  }

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <section>
      <div>
        <h2>Tasks</h2>
        <p>{currentWorkspace.name}</p>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
        >
          New Task
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {tasks.length === 0 ? (
        <p>This workspace doesn't have any tasks yet.</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => setCurrentTask(task)}
            >
              <div>
                <strong>{task.title}</strong>
              </div>

              <div>
                <span>{task.project.name}</span>
              </div>

              <div>
                <span>{task.status}</span>
                <span>{task.priority}</span>
              </div>

              <div>
                <span>
                  {task.description || 'No description provided.'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateTaskForm onClose={handleCreateFormClose} />
      )}
    </section>
  );
};

export default TaskList;
