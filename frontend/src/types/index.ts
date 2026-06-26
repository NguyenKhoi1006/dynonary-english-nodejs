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
  applicationStatus?: string;
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

// ─── Admin Types ────────────────────────────────────────────────

export interface AdminMaterial {
  uid: string;
  title: string;
  description: string;
  level: string;
  type: string;
  order: number;
  estimatedMinutes: number;
  published: boolean;
  isPremium: boolean;
  tags: string[];
  previewContent: string;
  content: string;
  createdDate?: string;
}

export interface AdminTest {
  uid: string;
  testId: string;
  title: string;
  level: string;
  questions: any[];
  passScore: number;
  timeMinutes: number;
  published: boolean;
  createdDate?: string;
}

export interface AdminPlacementTest {
  uid: string;
  testId: string;
  title: string;
  description: string;
  questions: any[];
  levelDistribution: Record<string, number>;
  timeMinutes: number;
  published: boolean;
  createdDate?: string;
}

export interface AdminTutor {
  uid: string;
  userId: string;
  name: string;
  email: string;
  avt: string;
  bio: string;
  subjects: string[];
  hourlyRate: number;
  level: string;
  rating: number;
  totalSessions: number;
  totalStudents: number;
  totalReviews: number;
  isAvailable: boolean;
  applicationStatus: string;
  createdDate?: string;
}

export interface AdminTutorDetail extends AdminTutor {
  qualifications: string[];
  videoIntro: string;
  userEmail: string;
  userMembership: string;
  userStatus: string;
}

export interface AdminWord {
  uid: string;
  word: string;
  meaning: string;
  level: string;
  type: string;
  topic: string;
  phonetic?: string;
  example?: string;
  createdDate?: string;
}

export interface AdminSentence {
  uid: string;
  english: string;
  vietnamese: string;
  topic: string;
  createdDate?: string;
}

export interface AdminTopic {
  uid: string;
  name: string;
  type: string;
  description?: string;
  createdDate?: string;
}

export interface AdminIrregularVerb {
  uid: string;
  baseForm: string;
  pastSimple: string;
  pastParticiple: string;
  meaning: string;
  createdDate?: string;
}

export interface AdminBlogPost {
  uid: string;
  title: string;
  content: string;
  excerpt: string;
  type: string;
  published: boolean;
  tags: string[];
  createdDate?: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  adminId: string;
  adminName?: string;
  targetId?: string;
  details?: string;
  timestamp?: string;
}
