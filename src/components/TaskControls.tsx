import type { SortDirection, SortField } from '../utils/taskFilters';
import type { TaskPriority, TaskStatus } from '../types/task';
import { PRIORITY_LABELS, PRIORITIES, STATUSES, STATUS_LABELS } from '../types/task';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  ResetIcon,
  SearchIcon,
} from './Icons';

interface TaskControlsProps {
  search: string;
  statusFilter: string;
  priorityFilter: string;
  sortBy: SortField;
  sortDir: SortDirection;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onSortByChange: (value: SortField) => void;
  onSortDirToggle: () => void;
  onResetFilters: () => void;
  onAdd: () => void;
}

/**
 * Панель управления списком: поиск (FR-07), фильтры со сбросом (FR-08),
 * сортировка (FR-09) и кнопка создания (FR-02).
 */
export function TaskControls({
  search,
  statusFilter,
  priorityFilter,
  sortBy,
  sortDir,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortByChange,
  onSortDirToggle,
  onResetFilters,
  onAdd,
}: TaskControlsProps) {
  return (
    <section className="controls" aria-label="Поиск, фильтры и сортировка">
      <div className="controls__row">
        <div className="control">
          <label className="control__label" htmlFor="task-search">
            Поиск по названию
          </label>
          <div className="control__search-wrap">
            <SearchIcon className="control__search-icon" />
            <input
              id="task-search"
              type="search"
              className="control__input"
              placeholder="Часть названия…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="control">
          <label className="control__label" htmlFor="task-status-filter">
            Статус
          </label>
          <select
            id="task-status-filter"
            className="control__select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {STATUSES.map((status: TaskStatus) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="control">
          <label className="control__label" htmlFor="task-priority-filter">
            Приоритет
          </label>
          <select
            id="task-priority-filter"
            className="control__select"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
          >
            <option value="all">Все приоритеты</option>
            {PRIORITIES.map((priority: TaskPriority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </div>
        <div className="control">
          <label className="control__label" htmlFor="task-sort">
            Сортировка
          </label>
          <div className="control__sort-group">
            <select
              id="task-sort"
              className="control__select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortField)}
            >
              <option value="createdAt">По дате создания</option>
              <option value="dueDate">По сроку выполнения</option>
            </select>
            <button
              type="button"
              className="btn btn--icon"
              onClick={onSortDirToggle}
              aria-label={
                sortDir === 'asc'
                  ? 'Направление сортировки: по возрастанию. Переключить'
                  : 'Направление сортировки: по убыванию. Переключить'
              }
              title={
                sortDir === 'asc' ? 'По возрастанию' : 'По убыванию'
              }
            >
              <span className="btn__icon">
                {sortDir === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </span>
            </button>
          </div>
        </div>
        <div className="control control--actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
          >
            <span className="btn__icon">
              <ResetIcon />
            </span>
            Сбросить фильтры
          </button>
          <button type="button" className="btn btn--primary" onClick={onAdd}>
            <span className="btn__icon">
              <PlusIcon />
            </span>
            Добавить задачу
          </button>
        </div>
      </div>
    </section>
  );
}
