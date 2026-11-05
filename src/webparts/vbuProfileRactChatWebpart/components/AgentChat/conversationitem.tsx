import * as React from 'react';
import { IConversation } from '../Models/IChatModels';
import styles from '../VbuProfileRactChatWebpart.module.scss';

interface IConversationItemProps {
  conversation: IConversation;
  isActive:     boolean;
  onClick:      () => void;
}

const ConversationItem: React.FC<IConversationItemProps> = ({
  conversation,
  isActive,
  onClick
}) => {
  const formattedDate = new Date(conversation.updatedAt).toLocaleDateString([], {
    month: 'short',
    day:   'numeric'
  });

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`${styles.conversationItem} ${isActive ? styles.activeConversation : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Conversation: ${conversation.title || 'Untitled'}, last updated ${formattedDate}`}
    >
      <div className={styles.convIcon} aria-hidden="true">💬</div>
      <div className={styles.convMeta}>
        <div className={styles.convTitle}>
          {conversation.title || 'New Conversation'}
        </div>
        <div className={styles.convDate}>{formattedDate}</div>
      </div>
    </div>
  );
};

export default ConversationItem;
