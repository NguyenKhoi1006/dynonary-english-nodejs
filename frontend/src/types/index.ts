export interface User {
  uid: string;
  email: string;
  name: string;
  avt: string;
  role: 'student' | 'tutor' | 'admin';
  membership: 'free' | 'premium';
  status: 'active' | 'banned';
}

export interface TutorProfile {
  uid: string;
  userId: string;
  name: string;
  email: string;
  avt: string;
  bio: string;
  subjects: string[];
  hourlyRate: number;
  level: string;
  qualifications: string[];
  videoIntro: string;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  totalStudents: number;
}

export interface Course {
  uid: string;
  tutorId: string;
  tutorName: string;
  tutorAvt: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  price: number;
  thumbnail: string;
  totalLessons: number;
  totalStudents: number;
  totalDuration: number;
  rating: number;
  isPublished: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  uid: string;
  courseId: string;
  title: string;
  description: string;
  contentType: 'video' | 'pdf' | 'text' | 'link';
  contentUrl: string;
  duration: number;
  order: number;
  isFreePreview: boolean;
}

export interface Booking {
  uid: string;
  studentId: string;
  studentName: string;
  studentAvt: string;
  tutorId: string;
  tutorName: string;
  tutorAvt: string;
  courseId?: string;
  courseName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  note: string;
}

export interface Session {
  uid: string;
  studentId: string;
  studentName: string;
  studentAvt: string;
  tutorId: string;
  tutorName: string;
  tutorAvt: string;
  courseId?: string;
  courseName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  tutorNote: string;
  studentNote: string;
}

export interface Review {
  uid: string;
  studentId: string;
  studentName: string;
  studentAvt: string;
  tutorId: string;
  rating: number;
  comment: string;
  createdDate: string;
}

export interface Message {
  uid: string;
  senderId: string;
  senderName: string;
  senderAvt: string;
  receiverId: string;
  content: string;
  sessionId?: string;
  isRead: boolean;
  createdDate: string;
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvt: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}
