import * as React from 'react';
import { useChat } from '../Hooks/useChat';
import ChatSidebar from './chatSideBar';
import ChatHeader from './chatheader';
import ChatMessages from './chatmessages';
import ChatInput from './chatinput';
import styles from '../../components/VbuProfileRactChatWebpart.module.scss';
import { AadHttpClientFactory } from '@microsoft/sp-http';


const AgentChat: React.FC<{
  apiUrl: string;
  apiResource: string;
  aadHttpClientFactory: AadHttpClientFactory;
  userId: string;
  title: string;
  userEmail: string;
}> = (props) => {
  const {
    conversations,
    messages,
    activeConversationId,
    isLoading,
    isSidebarOpen,
    error,
    sendMessage,
    selectConversation,
    startNewConversation,
    toggleSidebar
  } = useChat(props.userId, props.userEmail, props.apiUrl, props.apiResource, props.aadHttpClientFactory);

  return (
    <div className={styles.chatContainer} role="application" aria-label="AI Chat Assistant">

      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={isSidebarOpen}
        onSelectConversation={selectConversation}
        //onNewConversation={startNewConversation}
      />

      <div className={styles.chatMain}>

        <ChatHeader
          title={props.title}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onNewConversation={startNewConversation}
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          error={error}
          userName={props.userId}
          conversations={conversations}
          conversationId={activeConversationId}
          apiBaseUrl={props.apiUrl}
          apiResource={props.apiResource}
          aadHttpClientFactory={props.aadHttpClientFactory}
        />

        <ChatInput
          isLoading={isLoading}
          onSend={sendMessage}
        />

      </div>
    </div>
  );
};

export default AgentChat;
