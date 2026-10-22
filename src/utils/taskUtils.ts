/** Генерация уникального идентификатора задачи. */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Текущие дата и время в ISO-строке. */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Валидация названия (FR-02): обязательно; после удаления пробелов
 * строка не должна быть пустой. Возвращает текст ошибки или null.
 */
export function validateTitle(title: string): string | null {
  if (!title.trim()) {
    return 'Название задачи обязательно и не может быть пустым';
  }
  return null;
}

/** Человекочитаемое отображение срока. */
export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) {
    return 'Без срока';
  }
  // Парсим как локальную дату без смещения часового пояса
  const date = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return 'Без срока';
  }
  return date.toLocaleDateString('ru-RU');
}

/** Короткое отображение даты создания/изменения. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
