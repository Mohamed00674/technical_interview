export interface BlogComment {
  _id?: string;
  content: string;
  author?: { username?: string; avatar?: string };
  replies?: BlogComment[];
  createdAt?: string;
}

export interface Blog {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  author?: { username?: string; fullname?: string; avatar?: string };
  comments?: BlogComment[];
  createdAt?: string;
  updatedAt?: string;
}
