export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  userId: number;
  username: string;
  createdAt: string;
}

export interface PostPayload {
  title: string;
  content: string;
  image: string;
}
