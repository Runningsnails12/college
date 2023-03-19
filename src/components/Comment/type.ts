import { CSSProperties, ReactNode } from 'react';

// 评论
export interface CommentApi {
  id: number
  parentId: number | null
  parentName: string | null
  uid: number
  username: string
  avatar: string
  level: number
  link: string
  address: string
  content: string
  like: number
  createTime: string
  reply?: ReplyApi | null
}

// 回复
export interface ReplyApi {
  total: number
  list: CommentApi[]
}
