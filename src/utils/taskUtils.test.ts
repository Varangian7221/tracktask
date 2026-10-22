import { describe, expect, it } from 'vitest';
import { formatDueDate, generateId, validateTitle } from './taskUtils';

describe('validateTitle (FR-02)', () => {
  it('пустое название отклоняется', () => {
    expect(validateTitle('')).not.toBeNull();
  });

  it('название, состоящее только из пробелов, отклоняется', () => {
    expect(validateTitle('   ')).not.toBeNull();
  });

  it('название с текстом проходит валидацию', () => {
    expect(validateTitle('Купить молоко')).toBeNull();
  });

  it('название с пробелами по краям проходит валидацию', () => {
    expect(validateTitle('  Задача  ')).toBeNull();
  });
});

describe('generateId', () => {
  it('генерирует уникальные идентификаторы', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('formatDueDate (FR-01)', () => {
  it('возвращает «Без срока» для null', () => {
    expect(formatDueDate(null)).toBe('Без срока');
  });

  it('форматирует корректную дату', () => {
    expect(formatDueDate('2026-02-10')).toBe('10.02.2026');
  });

  it('некорректная дата не приводит к падению', () => {
    expect(formatDueDate('не-дата')).toBe('Без срока');
  });
});
