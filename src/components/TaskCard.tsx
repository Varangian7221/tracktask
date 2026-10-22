import type { Task } from '../types/task';
import { PRIORITY_LABELS, STATUS_LABELS } from '../types/task';
import { formatDateTime, formatDueDate } from '../utils/taskUtils';
import { PencilIcon, TrashIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** Карточка задачи в списке: название, статус, приоритет, срок (FR-01). */
export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <li className={`task-card task-card--${task.status}`}>
      <div className="task-card__main">
        <h3 className="task-card__title">{task.title}</h3>
        <div className="task-card__badges">
          <span className={`badge badge--status badge--status--${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`badge badge--priority badge--priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span
            className={`badge badge--due${task.dueDate ? '' : ' badge--due-empty'}`}
          >
            {formatDueDate(task.dueDate)}
          </span>
        </div>
        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}
        <p className="task-card__meta">
          Создано: {formatDateTime(task.createdAt)}
          {task.updatedAt !== task.createdAt && (
            <> · Изменено: {formatDateTime(task.updatedAt)}</>
          )}
        </p>
      </div>
      <div className="task-card__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onEdit(task)}
        >
          <span className="btn__icon">
            <PencilIcon />
          </span>
          Редактировать
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--danger-quiet"
          onClick={() => onDelete(task)}
        >
          <span className="btn__icon">
            <TrashIcon />
          </span>
          Удалить
        </button>
      </div>
    </li>
  );
}
