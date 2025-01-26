export interface IConversation {
  auto: boolean;
  phoneNumber: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface IMessage {
  conversationId: string;
  message: string;
  sender: 'company' | 'customer';
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}
export interface IOptionTextItem {
  option: string;
  text: string;
}

export interface IService {
  title: string;
  description: string;
  items: IOptionTextItem[];
}
