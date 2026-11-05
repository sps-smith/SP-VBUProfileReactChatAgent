import * as React from 'react';
import styles from '../VbuProfileRactChatWebpart.module.scss';

const TypingIndicator: React.FC = () => (
  <div className={styles.typingIndicator} role="status" aria-label="Assistant is typing">
    <span className={styles.dot} />
    <span className={styles.dot} />
    <span className={styles.dot} />
  </div>
);

export default TypingIndicator;
