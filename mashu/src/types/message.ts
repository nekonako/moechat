export type Message = {
  message: string;
  clientId: number;
  username: string;
  roomId: string;
  type: 'recv' | 'self';
};
