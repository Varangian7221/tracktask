/** Статус задачи. Ровно три значения (FR-04). */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/** Приоритет задачи. Ровно три значения (FR-05). */
export type TaskPriority = 'low' | 'medium' | 'high';

/** Модель задачи по разделу 5 ТЗ. */
export interface Task {
  /** Уникальный идентификатор. */
  id: string;
  /** Название (обязательное, непустое после trim). */
  title: string;
  /** Описание (необязательное). */
  description: string;
  /** Статус из перечня TaskStatus. */
  status: TaskStatus;
  /** Приоритет из перечня TaskPriority. */
  priority: TaskPriority;
  /** Срок выполнения в формате YYYY-MM-DD или null, если не задан. */
  dueDate: string | null;
  /** Дата и время создания (ISO). */
  createdAt: string;
  /** Дата и время последнего изменения (ISO). */
  updatedAt: string;
}

/** Данные формы создания/редактирования (без служебных полей). */
export interface TaskDraft {
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
}

export const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];
export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

/** Единые обозначения статусов (FR: «использовать единые обозначения»). */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'К выполнению',
  in_progress: 'В работе',
  done: 'Выполнена',
};

/** Единые обозначения приоритетов. */
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};
