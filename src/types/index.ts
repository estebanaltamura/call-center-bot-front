export interface Conversation {
  auto: boolean;
  phoneNumber: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface Message {
  conversationId: string;
  message: string;
  sender: 'company' | 'customer';
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}
