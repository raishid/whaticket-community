export interface MessageType {
  mediaUrl: string;
  id: string;
  ack: number;
  read: boolean;
  fromMe: boolean;
  body: string | null;
  mediaType?: string;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  quotedMsgId: null;
  ticketId: number;
  contactId: number;
  contact?: Contact;
  quotedMsg?: MessageType;
  ack?: number;
}

export interface Contact {
  id: number;
  name: string;
  number: string;
  email?: string;
  profilePicUrl?: string;
  isGroup?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
