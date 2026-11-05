import * as React from 'react';
import styles from '../VbuProfileRactChatWebpart.module.scss';

interface IChatHeaderProps {
  title:             string;
  isSidebarOpen:     boolean;
  onToggleSidebar:   () => void;
  onNewConversation: () => void;
}

const ChatHeader: React.FC<IChatHeaderProps> = ({
  title,
  isSidebarOpen,
  onToggleSidebar,
  onNewConversation
}) => {

    const chattitle = 'VBU Marketplace Assistant'; // You can customize this title as needed

    const goHome = ():void => {
        window.location.href = '/sites/VBUMarketplace'; // Change this URL to your desired home page
    };

    return (
        <header className={styles.chatHeader}>
        <button
            className={styles.toggleSidebar}
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            aria-label={isSidebarOpen ? 'Hide conversation list' : 'Show conversation list'}
            aria-expanded={isSidebarOpen}
        >
            ☰
        </button>

        <div className={styles.headerTitle}>
            {/* <span className={styles.headerIcon} aria-hidden="true">🤖</span> */}
            {chattitle}
        </div>

        
        <button
            className={styles.newChatBtnHeader}
            onClick={goHome}
            aria-label="Back to home page"
        >
            {'<'} Back
        </button>

        <button
            className={styles.newChatBtnHeader}
            onClick={onNewConversation}
            aria-label="Start new conversation"
        >
            + New Chat
        </button>
        </header>
    );
};

export default ChatHeader;
