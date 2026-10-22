import type { FormEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import type { Task, TaskDraft, TaskPriority, TaskStatus } from '../types/task';
import { PRIORITY_LABELS, PRIORITIES, STATUSES, STATUS_LABELS } from '../types/task';
import { validateTitle } from '../utils/taskUtils';

export type TaskFormSubmit = (draft: TaskDraft) => void;

interface TaskFormProps {
  /** Задача для редактирования или null при создании. */
  task: Task | null;
  onSubmit: TaskFormSubmit;
  onCancel: () => void;
}

const DRAFT_DUE_DATE_PLACEHOLDER = '';

/**
 * Форма создания/редактирования задачи (FR-02, FR-03, раздел 6 ТЗ).
 * Ошибки валидации показываются рядом с полем, введённые данные
 * не теряются (FR-12).
 */
export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dueDateId = useId();
  const priorityId = useId();
  const statusId = useId();
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ?? DRAFT_DUE_DATE_PLACEHOLDER,
  );
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? 'medium',
  );
  // FR-04: при создании используется статус «К выполнению»
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo');
  const [titleError, setTitleError] = useState<string | null>(null);

  // Фокус на первом поле при открытии формы
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const isEdit = task !== null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateTitle(title);
    if (error) {
      setTitleError(error);
      // Данные не теряем: состояние формы сохраняется (FR-12)
      titleRef.current?.focus();
      return;
    }
    setTitleError(null);
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate === '' ? null : dueDate,
      priority,
      status,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        // Клик по подложке закрывает модальное окно
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <h2 id="task-form-title" className="modal__title">
          {isEdit ? 'Редактирование задачи' : 'Новая задача'}
        </h2>
        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <div className="task-form__field">
            <label className="control__label" htmlFor={titleId}>
              Название <span className="required-mark">*</span>
            </label>
            <input
              id={titleId}
              ref={titleRef}
              type="text"
              className={`control__input${titleError ? ' control__input--error' : ''}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) {
                  setTitleError(null);
                }
              }}
              aria-invalid={titleError !== null}
              aria-describedby={titleError ? `${titleId}-error` : undefined}
            />
            {titleError && (
              <p id={`${titleId}-error`} className="field-error" role="alert">
                {titleError}
              </p>
            )}
          </div>

          <div className="task-form__field">
            <label className="control__label" htmlFor={descriptionId}>
              Описание
            </label>
            <textarea
              id={descriptionId}
              className="control__input control__textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Необязательное описание задачи"
            />
          </div>

          <div className="task-form__field">
            <label className="control__label" htmlFor={dueDateId}>
              Срок выполнения
            </label>
            <input
              id={dueDateId}
              type="date"
              className="control__input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="task-form__field">
            <label className="control__label" htmlFor={priorityId}>
              Приоритет
            </label>
            <select
              id={priorityId}
              className="control__select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          <div className="task-form__field">
            <label className="control__label" htmlFor={statusId}>
              Статус
            </label>
            {isEdit ? (
              <select
                id={statusId}
                className="control__select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <select
                  id={statusId}
                  className="control__select"
                  value={status}
                  disabled
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <p className="control__hint">
                  Новая задача всегда создаётся со статусом «К выполнению».
                </p>
              </>
            )}
          </div>

          <div className="modal__actions">
            <button type="submit" className="btn btn--primary">
              {isEdit ? 'Сохранить изменения' : 'Создать задачу'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onCancel}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
