export enum DocumentType {
  SRF_FORM = 'SRF Application Form',
  ACCEPTANCE_LETTER = 'University Acceptance Letter',
  MATRIC_CERT = 'Matric Certificate',
  FEE_STRUCTURE = 'Fee Structure',
  ACCOUNT_STATEMENT = 'Account Statement',
  RESULTS = 'Academic Results',
  POP = 'Proof of Payment (Admin)',
  ID = 'Identification Document'
}

export const QUARTERLY_DOCS = [
  DocumentType.FEE_STRUCTURE,
  DocumentType.ACCOUNT_STATEMENT,
  DocumentType.RESULTS
];

export enum ApplicationStatus {
  PENDING = 'Pending Submission',
  SUBMITTED = 'Submitted',
  REVIEWING = 'Under Review',
  APPROVED = 'Approved',
  REJECTED = 'Action Required',
  MORE_INFO = 'More Info Needed'
}

export type UserRole = 'student' | 'admin';

export interface StudentDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadedAt: Date;
  status: 'verified' | 'pending' | 'rejected';
  fileSize: string;
  quarter?: number; // 1-4
  year?: number;
}

export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
}

export interface ParentDetails {
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  university: string;
  residentialAddress: string;
  parentDetails: ParentDetails;
  course: string;
  yearOfStudy: number;
  bankDetails?: BankDetails;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: Date;
}