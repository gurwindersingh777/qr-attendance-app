export type Role = 'student' | 'teacher' | 'admin'

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  rollNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Subject {
  _id: string
  subjectName: string
  subjectCode: string
  teacherId: User | string
  students: User[] | string[]
  createdAt: string
  updatedAt: string
}

export interface Session {
  _id: string
  teacherId: User | string
  subjectId: Subject | string
  startTime: Date
  endTime: Date
  manualCode: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Record {
  _id: string
  studentId: string
  sessionId: string
  createdAt: string
  updatedAt: string
}

export interface Summary {
  _id: string
  studentId: User | string
  subjectId: Subject | string
  totalSessions: number
  attendedSessions: number
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id: string
  userId: string
  message: string
  isRead: boolean
  type: 'low_attendance' | 'warning' | 'info'
  createdAt: string
}

