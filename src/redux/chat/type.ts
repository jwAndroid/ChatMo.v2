export interface User {
  _id: string;
}

export interface MessageEntity {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  received?: boolean;
}
