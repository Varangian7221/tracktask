interface SummaryProps {
  total: number;
  active: number;
  done: number;
}

/** Сводка по задачам (FR-10): всего, незавершённых, выполненных. */
export function Summary({ total, active, done }: SummaryProps) {
  return (
    <section className="summary" aria-label="Сводка по задачам">
      <div className="summary__item">
        <span className="summary__value">{total}</span>
        <span className="summary__label">Всего задач</span>
      </div>
      <div className="summary__item">
        <span className="summary__value">{active}</span>
        <span className="summary__label">Незавершённых</span>
      </div>
      <div className="summary__item">
        <span className="summary__value">{done}</span>
        <span className="summary__label">Выполнено</span>
      </div>
    </section>
  );
}
