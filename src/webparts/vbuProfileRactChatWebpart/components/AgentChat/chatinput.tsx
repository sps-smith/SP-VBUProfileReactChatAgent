import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from '../VbuProfileRactChatWebpart.module.scss'

interface IChatInputProps {
  isLoading: boolean;
  onSend:    (message: string) => void;
}

const ChatInput: React.FC<IChatInputProps> = ({ isLoading, onSend }) => {
  const [value, setValue] = useState('');
  const textareaRef       = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

  const handleSend = (): void => {
    const text = value.trim();
    if (!text || isLoading) return;
    setValue('');
    onSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <footer className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.messageInput}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={isLoading}
          aria-label="Message input"
          aria-multiline="true"
        />
        <button
          className={`${styles.sendBtn} ${!canSend ? styles.sendBtnDisabled : ''}`}
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          title="Send (Enter)"
        >
          {isLoading ? '⏳' : '➤'}
        </button>
      </div>
      <div className={styles.inputHint} aria-hidden="true">
        Enter to send &nbsp;·&nbsp; Shift+Enter for new line
      </div>
    </footer>
  );
};

export default ChatInput;
