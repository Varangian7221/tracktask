import { beforeEach, describe, expect, it } from 'vitest';
import type { Task } from '../types/task';
import { loadTasks, saveTasks } from './taskStorage';

const STORAGE_KEY = 'taskflow.tasks.v1';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'id-1',
    title: 'Тестовая задача',
    description: 'Описание',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadTasks (FR-11)', () => {
  it('возвращает пустой список, если данных ещё нет', async () => {
    const result = await loadTasks(window.localStorage);
    expect(result).toEqual({ tasks: [], error: null });
  });

  it('читает сохранённые задачи', async () => {
    const task = makeTask();
    saveTasks([task], window.localStorage);
    const result = await loadTasks(window.localStorage);
    expect(result.error).toBeNull();
    expect(result.tasks).toEqual([task]);
  });

  it('повреждённый JSON не приводит к падению и возвращает ошибку', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{oops');
    const result = await loadTasks(window.localStorage);
    expect(result.tasks).toEqual([]);
    expect(result.error).not.toBeNull();
  });

  it('данные неверной структуры отклоняются с ошибкой', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 1 }]));
    const result = await loadTasks(window.localStorage);
    expect(result.tasks).toEqual([]);
    expect(result.error).not.toBeNull();
  });

  it('строка вместо массива отклоняется', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify('hello'));
    const result = await loadTasks(window.localStorage);
    expect(result.tasks).toEqual([]);
    expect(result.error).not.toBeNull();
  });
});

describe('saveTasks (FR-11)', () => {
  it('сохраняет и позволяет прочитать обратно', async () => {
    const tasks = [
      makeTask({ id: '1', title: 'Первая' }),
      makeTask({ id: '2', title: 'Вторая', status: 'done', priority: 'high' }),
    ];
    const saveResult = saveTasks(tasks, window.localStorage);
    expect(saveResult.ok).toBe(true);

    const loadResult = await loadTasks(window.localStorage);
    expect(loadResult.tasks).toEqual(tasks);
  });

  it('возвращает понятную ошибку при сбое хранилища', () => {
    const brokenStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota exceeded');
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage;

    const result = saveTasks([], brokenStorage);
    expect(result.ok).toBe(false);
    expect(result.error).not.toBeNull();
  });
});
