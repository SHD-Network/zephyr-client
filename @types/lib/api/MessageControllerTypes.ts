import { ApiResponse } from './ApiControllerTypes';

export type MessageType = {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  sender: any[];
  recipient: any[];
  read: boolean;
  groupChat?: any;
};

export type GroupChatType = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: any[];
  messages: MessageType[];
};

export type ListMessagesResponse = ApiResponse & {
  groups: GroupChatType[];
  chats: MessageType[];
};
