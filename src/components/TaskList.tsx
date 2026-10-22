import type { Task } from '../types/task';
import { ClipboardListIcon } from './Icons';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  hasActiveFilters: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * Список задач с состояниями (FR-01, раздел 6 ТЗ):
 * пустой список и отсутствие результатов поиска/фильтров.
 */
export function TaskList({
  tasks,
  hasActiveFilters,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state" role="status">
        <ClipboardListIcon className="empty-state__icon" />
        {hasActiveFilters ? (
          <>
            <p className="empty-state__title">Ничего не найдено</p>
            <p className="empty-state__hint">
              Измените поисковый запрос или сбросьте фильтры.
            </p>
          </>
        ) : (
          <>
            <p className="empty-state__title">Задач пока нет</p>
            <p className="empty-state__hint">
              Нажмите «Добавить задачу», чтобы создать первую задачу.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
