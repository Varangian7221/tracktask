/**
 * Линейные иконки единого стиля (брендбук TaskFlow):
 * обводка currentColor, скругления концов, viewBox 24×24.
 */
interface IconProps {
  /** Дополнительный CSS-класс размера/позиционирования. */
  className?: string;
}

const svgProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="18" height="18">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ResetIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="16" height="16">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

/** Значок в логотипе: галочка в скругленном квадрате. */
export function LogoMarkIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="20" height="20">
      <path d="M4 8.5C4 6 6 4 8.5 4h7C18 4 20 6 20 8.5v7c0 2.5-2 4.5-4.5 4.5h-7C6 20 4 18 4 15.5Z" />
      <path d="m8.5 12 2.5 2.5 4.5-4.5" />
    </svg>
  );
}

/** Иконка пустого состояния: список задач. */
export function ClipboardListIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className} width="40" height="40">
      <path d="M8 4h8a2 2 0 0 1 2 2v1H8V6a2 2 0 0 1 0-2Z" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <path d="M8.5 11h7M8.5 15h5" />
    </svg>
  );
}
