import * as React from 'react';
import { IMessage } from '../Models/IChatModels';
import styles from '../VbuProfileRactChatWebpart.module.scss';
import HtmlReader from '../Reader/htmlreader';
//import { Icon } from '@fluentui/react';

interface IMessageBubbleProps {
  message: IMessage;
}

const MessageBubble: React.FC<IMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

//   const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
//     hour:   '2-digit',
//     minute: '2-digit'
//   });

  return (
    <div
      className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}
      role="listitem"
    >
      {/* <div className={styles.bubbleAvatar} aria-hidden="true">
        {isUser ? '👤' : '🤖'}
      </div> */}
      <div className={styles.bubbleContent}>
        <div className={styles.bubbleText}>
          <HtmlReader content={message.content} />
        </div>
        {/* <div className={styles.msgfooter}>
            {!isUser && 
            <div title="Copy message" onClick={() => navigator.clipboard.writeText('[Question] \r\n' + currentinput + '\r\n\r\n[Response] \r\n' + message.content)}>
                <Icon iconName="Copy" styles={{ root: { fontSize: 16 } }} />
            </div>} */}
            {/* <div className={styles.bubbleTime} aria-label={`Sent at ${formattedTime}`}>
                {formattedTime}
            </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default MessageBubble;
