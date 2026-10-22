import type { Task } from '../types/task';

export type SortField = 'createdAt' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilterState {
  search: string;
  status: string | null;
  priority: string | null;
}

/**
 * Фильтрация задач (FR-07, FR-08): поиск по части названия без учёта
 * регистра и точного совпадения; фильтры по статусу и приоритету.
 * Функция не изменяет исходные данные — возвращает новый массив.
 */
export function filterTasks(tasks: Task[], filter: TaskFilterState): Task[] {
  const search = filter.search.trim().toLowerCase();
  return tasks.filter((task) => {
    const matchesSearch =
      search === '' || task.title.toLowerCase().includes(search);
    const matchesStatus =
      filter.status === null || filter.status === '' || task.status === filter.status;
    const matchesPriority =
      filter.priority === null ||
      filter.priority === '' ||
      task.priority === filter.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
}

/**
 * Сортировка задач (FR-09): по сроку выполнения или дате создания.
 * Задачи без срока всегда выводятся после задач с заданным сроком —
 * независимо от направления сортировки.
 */
export function sortTasks(
  tasks: Task[],
  field: SortField,
  direction: SortDirection,
): Task[] {
  const sign = direction === 'asc' ? 1 : -1;
  const result = [...tasks];

  if (field === 'dueDate') {
    // Сначала задачи с заданным сроком (по возрастанию срока),
    // затем задачи без срока — стабильно в исходном порядке.
    const withDate = result
      .filter((task) => task.dueDate !== null)
      .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : a.dueDate! > b.dueDate! ? 1 : 0));
    const withoutDate = result.filter((task) => task.dueDate === null);
    return direction === 'asc'
      ? [...withDate, ...withoutDate]
      : [...withDate.reverse(), ...withoutDate];
  }

  // Сортировка по дате создания (поле всегда заполнено)
  return result.sort((a, b) => {
    if (a.createdAt < b.createdAt) return -1 * sign;
    if (a.createdAt > b.createdAt) return 1 * sign;
    return 0;
  });
}
