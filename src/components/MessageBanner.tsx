import { XIcon } from './Icons';

export interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

interface MessageBannerProps {
  message: FeedbackMessage | null;
  onDismiss: () => void;
}

/** Баннер обратной связи (FR-12): успех или понятная ошибка. */
export function MessageBanner({ message, onDismiss }: MessageBannerProps) {
  if (message === null) {
    return null;
  }
  return (
    <div
      className={`message message--${message.type}`}
      role={message.type === 'error' ? 'alert' : 'status'}
    >
      <span className="message__text">{message.text}</span>
      <button
        type="button"
        className="message__close"
        onClick={onDismiss}
        aria-label="Закрыть сообщение"
      >
        <XIcon />
      </button>
    </div>
  );
}
