import * as React from 'react';
import styles from './VbuProfileRactChatWebpart.module.scss';
import type { IVbuProfileRactChatWebpartProps } from './IVbuProfileRactChatWebpartProps';
import AgentChat from './AgentChat/chat';

export default class VbuProfileRactChatWebpart extends React.Component<IVbuProfileRactChatWebpartProps> {
  public render(): React.ReactElement<IVbuProfileRactChatWebpartProps> {
    const {
      description,
      hasTeamsContext,
        userDisplayName,
        apiUrl,
        apiResource,
        aadHttpClientFactory,
        userEmail
    } = this.props;

    return (
      <section className={`${styles.vbuProfileRactChatWebpart} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          
            <AgentChat
            apiUrl={apiUrl  }
            userId={userDisplayName}
            userEmail={userEmail}
            apiResource={apiResource}
            aadHttpClientFactory={aadHttpClientFactory}
            title={description}
          />
          
        </div>
      </section>
    );
  }
}
