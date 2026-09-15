import { ConversationKind, MessageStatus } from '../../enums/message.enum';
import { Member } from '../member/member';

export interface Message {
	_id: string;
	conversationId: string;
	kind: ConversationKind;
	carId?: string;
	senderId: string;
	receiverId: string;
	message: string;
	messageStatus: MessageStatus;
	createdAt: string;
	updatedAt: string;
	senderData?: Member;
}

export interface Conversation {
	conversationId: string;
	kind: ConversationKind;
	carId?: string;
	carTitle?: string;
	carImage?: string;
	lastMessage: string;
	lastMessageAt: string;
	unreadCount: number;
	partner?: Member;
}
