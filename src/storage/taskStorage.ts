import type { Task, TaskPriority, TaskStatus } from '../types/task';
import { PRIORITIES, STATUSES } from '../types/task';

const STORAGE_KEY = 'taskflow.tasks.v1';

export interface LoadResult {
  tasks: Task[];
  error: string | null;
}

export interface SaveResult {
  ok: boolean;
  error: string | null;
}

/** Проверка, что значение — корректная задача (защита от повреждённых данных). */
function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.description === 'string' &&
    typeof t.status === 'string' &&
    STATUSES.includes(t.status as TaskStatus) &&
    typeof t.priority === 'string' &&
    PRIORITIES.includes(t.priority as TaskPriority) &&
    (t.dueDate === null || typeof t.dueDate === 'string') &&
    typeof t.createdAt === 'string' &&
    typeof t.updatedAt === 'string'
  );
}

/**
 * Загрузка задач из localStorage (FR-11). Возвращает промис, чтобы
 * UI мог показать состояние загрузки. Повреждённые данные не приводят
 * к падению приложения — возвращается понятное сообщение об ошибке.
 */
export function loadTasks(storage?: Storage): Promise<LoadResult> {
  return new Promise((resolve) => {
    try {
      const store = storage ?? window.localStorage;
      const raw = store.getItem(STORAGE_KEY);
      if (raw === null) {
        resolve({ tasks: [], error: null });
        return;
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isValidTask)) {
        resolve({
          tasks: [],
          error: 'Сохранённые данные повреждены и не могут быть прочитаны',
        });
        return;
      }
      resolve({ tasks: parsed, error: null });
    } catch {
      resolve({
        tasks: [],
        error: 'Не удалось прочитать данные из хранилища браузера',
      });
    }
  });
}

/**
 * Сохранение задач в localStorage (FR-11). Ошибки (например, переполнение
 * квоты или приватный режим) возвращаются в виде сообщения для пользователя.
 */
export function saveTasks(tasks: Task[], storage?: Storage): SaveResult {
  try {
    const store = storage ?? window.localStorage;
    store.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true, error: null };
  } catch {
    return {
      ok: false,
      error: 'Не удалось сохранить данные в хранилище браузера',
    };
  }
}
