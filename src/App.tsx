import { useEffect, useMemo, useRef, useState } from 'react';
import type { Task, TaskDraft } from './types/task';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LogoMarkIcon } from './components/Icons';
import type { FeedbackMessage } from './components/MessageBanner';
import { MessageBanner } from './components/MessageBanner';
import { Summary } from './components/Summary';
import { TaskControls } from './components/TaskControls';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { loadTasks, saveTasks } from './storage/taskStorage';
import type { SortDirection, SortField } from './utils/taskFilters';
import { filterTasks, sortTasks } from './utils/taskFilters';
import { generateId, nowISO } from './utils/taskUtils';

/** Состояние модального окна: создание, редактирование или скрыто. */
type FormModalState = { mode: 'create' } | { mode: 'edit'; task: Task } | null;

const MESSAGE_TIMEOUT_MS = 4000;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Загрузка данных при запуске (FR-11)
  useEffect(() => {
    let cancelled = false;
    loadTasks().then((result) => {
      if (cancelled) {
        return;
      }
      setTasks(result.tasks);
      setLoadError(result.error);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Сохранение при каждом изменении списка (FR-11, FR-12)
  useEffect(() => {
    if (isLoading) {
      return;
    }
    const result = saveTasks(tasks);
    if (!result.ok) {
      showMessage({ type: 'error', text: result.error ?? 'Ошибка сохранения' });
    }
  }, [tasks, isLoading]);

  // Закрытие модальных окон по Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') {
        return;
      }
      if (taskToDelete !== null) {
        setTaskToDelete(null);
        return;
      }
      if (formModal !== null) {
        setFormModal(null);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [formModal, taskToDelete]);

  function showMessage(next: FeedbackMessage) {
    if (messageTimer.current !== null) {
      clearTimeout(messageTimer.current);
    }
    setMessage(next);
    messageTimer.current = setTimeout(() => {
      setMessage(null);
      messageTimer.current = null;
    }, MESSAGE_TIMEOUT_MS);
  }

  const hasActiveFilters =
    search.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, {
      search,
      status: statusFilter === 'all' ? null : statusFilter,
      priority: priorityFilter === 'all' ? null : priorityFilter,
    });
    return sortTasks(filtered, sortBy, sortDir);
  }, [tasks, search, statusFilter, priorityFilter, sortBy, sortDir]);

  const summary = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    return { total: tasks.length, done, active: tasks.length - done };
  }, [tasks]);

  function handleCreate(draft: TaskDraft) {
    const now = nowISO();
    const task: Task = {
      id: generateId(),
      title: draft.title,
      description: draft.description,
      status: 'todo',
      priority: draft.priority,
      dueDate: draft.dueDate,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [task, ...prev]);
    setFormModal(null);
    showMessage({ type: 'success', text: 'Задача успешно создана' });
  }

  function handleEdit(draft: TaskDraft) {
    if (formModal === null || formModal.mode !== 'edit') {
      return;
    }
    const editedTask = formModal.task;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editedTask.id
          ? { ...t, ...draft, updatedAt: nowISO() }
          : t,
      ),
    );
    setFormModal(null);
    showMessage({ type: 'success', text: 'Изменения сохранены' });
  }

  function handleFormSubmit(draft: TaskDraft) {
    if (formModal?.mode === 'edit') {
      handleEdit(draft);
    } else {
      handleCreate(draft);
    }
  }

  function handleConfirmDelete() {
    if (taskToDelete === null) {
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setTaskToDelete(null);
    showMessage({ type: 'success', text: 'Задача удалена' });
  }

  function handleResetFilters() {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            <LogoMarkIcon />
          </span>
          <div>
            <h1 className="app__title">TaskFlow</h1>
            <p className="app__subtitle">Трекер задач</p>
          </div>
        </div>
        <p className="app__subtitle">Учебный MVP</p>
      </header>

      <Summary total={summary.total} active={summary.active} done={summary.done} />

      <TaskControls
        search={search}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onSortByChange={setSortBy}
        onSortDirToggle={() =>
          setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        }
        onResetFilters={handleResetFilters}
        onAdd={() => setFormModal({ mode: 'create' })}
      />

      <MessageBanner message={message} onDismiss={() => setMessage(null)} />

      {loadError !== null && (
        <div className="message message--error" role="alert">
          <span className="message__text">{loadError}</span>
        </div>
      )}

      <main className="app__main">
        {isLoading ? (
          <div className="loading-state" role="status">
            Загрузка задач…
          </div>
        ) : (
          <TaskList
            tasks={visibleTasks}
            hasActiveFilters={hasActiveFilters}
            onEdit={(task) => setFormModal({ mode: 'edit', task })}
            onDelete={(task) => setTaskToDelete(task)}
          />
        )}
      </main>

      {formModal !== null && (
        <TaskForm
          task={formModal.mode === 'edit' ? formModal.task : null}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModal(null)}
        />
      )}

      {taskToDelete !== null && (
        <ConfirmDialog
          title="Удаление задачи"
          message={`Удалить задачу «${taskToDelete.title}»? Это действие нельзя отменить.`}
          confirmLabel="Удалить"
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
