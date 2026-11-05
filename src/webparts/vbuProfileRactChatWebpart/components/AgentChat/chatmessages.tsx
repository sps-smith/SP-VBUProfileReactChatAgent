import * as React from 'react';
import { useEffect, useRef } from 'react';
import { IConversation, IMessage } from '../Models/IChatModels';
import MessageBubble from './messagebubble';
import TypingIndicator from './typingindicator';
import styles from '../VbuProfileRactChatWebpart.module.scss';
import { Icon } from '@fluentui/react';
import { getHistory } from '../Services/ChatApiService';
import { AadHttpClientFactory } from '@microsoft/sp-http';
//import HtmlReader from '../Reader/htmlreader';

interface IChatMessagesProps {
    messages:  IMessage[];
    isLoading: boolean;
    error:     string | null;
    userName:  string;
    conversations: IConversation[];
    conversationId: string | null;
    apiBaseUrl: string;
    apiResource: string;
    aadHttpClientFactory: AadHttpClientFactory;
}

const ChatMessages: React.FC<IChatMessagesProps> = ({
    messages,
    isLoading,
    error,
    userName,
    conversations,
    conversationId,
    apiBaseUrl,
    apiResource,
    aadHttpClientFactory
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

//   const formattedTime = new Date().toLocaleTimeString([], {
//     hour:   '2-digit',
//     minute: '2-digit'
//   });

  // Auto-scroll to bottom on new messages  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0 && !isLoading;

  const copyConversations = (): void => {
    if (conversationId) {
        getHistory(conversationId, apiBaseUrl, apiResource, aadHttpClientFactory)
        .then(async history => {
            if (history.length > 0) {
                let data: string = '';
                history.forEach((msg: IMessage) => {
                    if (msg.role === 'user') {
                        data += '[Question] \r\n' + msg.content + '\r\n\r\n';
                    } else {
                        data += '[Response] \r\n' + msg.content + '\r\n\r\n';
                    }
                });
                await navigator.clipboard.writeText(data);
            }
        }).catch(err => console.error('Failed to copy conversation:', err));
    }
  };

  return (
        <main
        className={styles.messagesArea}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        >
        {showWelcome && (
            <div className={styles.welcomeState}>
            {/* <div className={styles.welcomeIcon} aria-hidden="true">🤖</div> */}
            {
                conversations.length > 0 ? (
                <h3>Welcome back {userName}</h3>
                ) : (
                <h3>Welcome {userName}</h3>
                )
            }
            {/* <h3>How can I help you today?</h3> */}
            <p>Ask me anything — I'm powered by VBU Marketplace agent..</p>
            </div>
        )}

        <div role="list">
            {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>

        {isLoading && messages.length > 0 && (
            <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
            {/* <div className={styles.bubbleAvatar} aria-hidden="true">🤖</div> */}
            <div className={styles.bubbleContent}>
                <TypingIndicator />
            </div>
            </div>
        )}

        {messages.length > 0 && !isLoading && 
            <div className={styles.msgfooter}>
                {/* {!isUser &&  */}
                <div title="Copy message" onClick={() => copyConversations()}  aria-label="Copy conversation">
                    <Icon iconName="Copy" styles={{ root: { fontSize: 20 } }} />
                </div>
                {/* <div className={styles.bubbleTime} aria-label={`Sent at ${formattedTime}`}>
                    {formattedTime}
                </div> */}
            </div>
        }

        {error && (
            <div className={styles.errorBanner} role="alert">
            ⚠️ {error}
            </div>
        )}

        <div ref={bottomRef} aria-hidden="true" />
        </main>
    );
};

export default ChatMessages;


