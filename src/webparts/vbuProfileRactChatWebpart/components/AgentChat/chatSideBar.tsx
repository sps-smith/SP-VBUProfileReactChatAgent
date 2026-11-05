import * as React from 'react';
import { IConversation } from '../Models/IChatModels';
import ConversationItem from './conversationitem'
import styles from '../VbuProfileRactChatWebpart.module.scss';

interface IChatSidebarProps {
	conversations:        IConversation[];
	activeConversationId: string | null;
	isOpen:               boolean;
	onSelectConversation: (id: string) => void;
	//onNewConversation:    () => void;
}

const ChatSidebar: React.FC<IChatSidebarProps> = ({
	conversations,
	activeConversationId,
	isOpen,
	onSelectConversation
	//onNewConversation
}) => {
    
    return (
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        aria-label="Conversation history"
        aria-hidden={!isOpen}
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Conversations - (last 5)</span>
          {/* <button
            className={styles.newChatBtn}
            onClick={onNewConversation}
            title="New conversation"
            aria-label="Start new conversation"
          >
            ✏️
          </button> */}
        </div>

        <div className={styles.conversationList} role="list">
          {conversations.length === 0 ? (
            <div className={styles.emptyState}>
              No conversations yet
            </div>
          ) : (
            conversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            ))
          )}
        </div>
      </aside>
    );
};

export default ChatSidebar;
