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

export interface IPromptItem {
  option: string;
  text: string;
}

export interface ISystemPromptDoc {
  id: string;
  title: string;
  prompts: string[];
}

// Ejemplo de interfaz para un servicio (puedes ajustarla a tus necesidades)
export interface IServiceItem {
  option: string;
  text: string;
}

export interface IService {
  title: string;
  description: string;
  items: IServiceItem[];
  fullChain: string;
  // items es la "posibilidad de option, text infinitos" que mencionaste
}
