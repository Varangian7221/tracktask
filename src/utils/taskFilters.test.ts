import { describe, expect, it } from 'vitest';
import type { Task } from '../types/task';
import { filterTasks, sortTasks } from './taskFilters';

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 'id-1',
    title: 'Задача',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('filterTasks (FR-07, FR-08)', () => {
  const tasks = [
    makeTask({ id: '1', title: 'Купить молоко', status: 'todo', priority: 'low' }),
    makeTask({ id: '2', title: 'Написать отчёт', status: 'in_progress', priority: 'high' }),
    makeTask({ id: '3', title: 'Купить хлеб', status: 'done', priority: 'medium' }),
  ];

  it('поиск находит задачи по части названия без учёта регистра', () => {
    const result = filterTasks(tasks, {
      search: 'КУПИТЬ',
      status: null,
      priority: null,
    });
    expect(result.map((t) => t.id)).toEqual(['1', '3']);
  });

  it('поиск по подстроке, не совпадающей полностью', () => {
    const result = filterTasks(tasks, { search: 'молок', status: null, priority: null });
    expect(result.map((t) => t.id)).toEqual(['1']);
  });

  it('фильтр по статусу', () => {
    const result = filterTasks(tasks, { search: '', status: 'done', priority: null });
    expect(result.map((t) => t.id)).toEqual(['3']);
  });

  it('фильтры по статусу и приоритету работают совместно', () => {
    const result = filterTasks(tasks, {
      search: 'купить',
      status: 'done',
      priority: 'medium',
    });
    expect(result.map((t) => t.id)).toEqual(['3']);
  });

  it('сброс фильтров (null) возвращает все задачи', () => {
    const result = filterTasks(tasks, { search: '', status: null, priority: null });
    expect(result).toHaveLength(3);
  });

  it('не изменяет исходный массив', () => {
    const before = [...tasks];
    filterTasks(tasks, { search: 'купить', status: 'todo', priority: 'low' });
    expect(tasks).toEqual(before);
  });

  it('поиск с пробелами по краям не ломает результат', () => {
    const result = filterTasks(tasks, { search: '  отчёт  ', status: null, priority: null });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });
});

describe('sortTasks (FR-09)', () => {
  const tasks = [
    makeTask({
      id: 'a',
      title: 'A',
      createdAt: '2026-01-03T10:00:00.000Z',
      dueDate: '2026-02-10',
    }),
    makeTask({
      id: 'b',
      title: 'B',
      createdAt: '2026-01-01T10:00:00.000Z',
      dueDate: null,
    }),
    makeTask({
      id: 'c',
      title: 'C',
      createdAt: '2026-01-02T10:00:00.000Z',
      dueDate: '2026-01-20',
    }),
  ];

  it('по дате создания (по возрастанию)', () => {
    const result = sortTasks(tasks, 'createdAt', 'asc');
    expect(result.map((t) => t.id)).toEqual(['b', 'c', 'a']);
  });

  it('по дате создания (по убыванию)', () => {
    const result = sortTasks(tasks, 'createdAt', 'desc');
    expect(result.map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('по сроку (по возрастанию), задачи без срока — в конце', () => {
    const result = sortTasks(tasks, 'dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['c', 'a', 'b']);
  });

  it('по сроку (по убыванию), задачи без срока всё равно в конце', () => {
    const result = sortTasks(tasks, 'dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('не изменяет исходный массив', () => {
    const before = [...tasks];
    sortTasks(tasks, 'createdAt', 'asc');
    expect(tasks).toEqual(before);
  });
});
