'use client';
import {
  GroupChatType,
  MessageType,
} from '@/@types/lib/api/MessageControllerTypes';
import { messageController } from '@/lib/api';
import { usePageSettings } from '@/redux';
import styles from '@/styles/Layouts/MessagesLayout.module.scss';
import { useCallback, useEffect, useState } from 'react';
import NewMessage from './newMessage';

type MessagesLayoutProps = {
  children: React.ReactNode;
};

function MessagesLayout({ children }: MessagesLayoutProps) {
  const setTitle = usePageSettings((state) => state.setTitle);
  const setSocketStatus = usePageSettings((state) => state.setSocketStatus);

  const [chats, setChats] = useState<MessageType[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChatType[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    setSocketStatus(messageController.socket.connected);

    messageController.socket.on('connect', () => {
      setSocketStatus(true);
    });

    messageController.socket.on('disconnect', () => {
      setSocketStatus(false);
    });

    return () => {
      setSocketStatus(false);
    };
  }, [setSocketStatus]);

  const loadPage = useCallback(async () => {
    setTitle('Messages');

    const messages = await messageController.list();
    setChats(messages.chats);
    setGroupChats(messages.groups);
    setLoadingChats(false);
  }, [setTitle]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);
  return loadingChats ? (
    <div className={styles.messagesLayout}>Loading...</div>
  ) : chats.length === 0 && groupChats.length === 0 ? (
    <NewMessage />
  ) : (
    <div className={styles.messagesLayout}>
      <div className={styles.sidebar}></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default MessagesLayout;
