import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  UserCircle, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  GraduationCap,
  Wallet,
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  ArrowRight,
  Mail
} from 'lucide-react';
import { 
  StudentProfile, 
  StudentDocument, 
  ApplicationStatus, 
  DocumentType,
  UserRole,
  AppNotification,
  QUARTERLY_DOCS
} from './types';
import { FileUpload } from './components/FileUpload';
import { Button } from './components/Button';
import { ChatAssistant } from './components/ChatAssistant';

// --- MOCK DATA ---
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Welcome to SRF',
    message: 'Please complete your profile and upload initial documents.',
    type: 'info',
    isRead: false,
    timestamp: new Date()
  }
];

const INITIAL_DOCS: StudentDocument[] = [
  {
    id: '1',
    type: DocumentType.SRF_FORM,
    fileName: 'srf_application_signed.pdf',
    uploadedAt: new Date('2024-01-15'),
    status: 'verified',
    fileSize: '1.2 MB'
  }
];

const MOCK_STUDENT: StudentProfile = {
  id: 'ST-2024-001',
  firstName: 'Jane',
  lastName: 'Doe',
  studentNumber: '2400516',
  email: 'jane.doe@university.edu',
  university: 'University of Technology',
  residentialAddress: '123 Student Village, Campus Road, Cityville',
  parentDetails: {
    fatherName: 'John Doe Sr.',
    fatherPhone: '+27 82 123 4567',
    motherName: 'Mary Doe',
    motherPhone: '+27 82 987 6543'
  },
  course: 'BSc Computer Science',
  yearOfStudy: 2,
  bankDetails: {
    accountHolder: 'J Doe',
    bankName: 'National Student Bank',
    accountNumber: '**** **** **** 1234',
    branchCode: '00123'
  }
};

const MOCK_STUDENTS_LIST: StudentProfile[] = [
  MOCK_STUDENT,
  {
    ...MOCK_STUDENT,
    id: 'ST-2024-002',
    firstName: 'Michael',
    lastName: 'Smith',
    studentNumber: '2400517',
    course: 'BEng Civil Engineering',
    email: 'mike.smith@tech.edu'
  }
];

// --- VIEW COMPONENTS ---

const NotificationBell: React.FC<{ notifications: AppNotification[], markRead: (id: string) => void }> = ({ notifications, markRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Notifications</span>
            {unreadCount > 0 && <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">{unreadCount} new</span>}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 py-4 text-sm">No notifications</p>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="flex items-start">
                    <div className={`mt-1 h-2 w-2 rounded-full mr-2 flex-shrink-0 ${n.type === 'error' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardView: React.FC<{ user: StudentProfile, status: ApplicationStatus, docs: StudentDocument[] }> = ({ user, status, docs }) => {
  const coreDocs = [DocumentType.SRF_FORM, DocumentType.ACCEPTANCE_LETTER, DocumentType.MATRIC_CERT];
  const uploadedCore = docs.filter(d => coreDocs.includes(d.type)).length;
  const progress = Math.min(100, (uploadedCore / 3) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Welcome back, {user.firstName}!</h2>
        <p className="text-teal-100 mb-6">Student Relief Fund Dashboard</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-teal-100">Application Status</p>
            <div className="flex items-center mt-2">
              <span className={`w-3 h-3 rounded-full mr-2 animate-pulse ${status === ApplicationStatus.APPROVED ? 'bg-green-400' : status === ApplicationStatus.REJECTED ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
              <span className="text-xl font-bold">{status}</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-teal-100">Next Disbursement</p>
            <p className="text-xl font-bold mt-2">Oct 15, 2024</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-teal-600" size={20}/>
                Core Document Checklist
            </h3>
            <div className="space-y-4">
                {coreDocs.map((type) => {
                    const doc = docs.find(d => d.type === type);
                    return (
                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{type}</span>
                            {doc ? (
                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {doc.status}
                                </span>
                            ) : (
                                <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    Missing
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Registration Completion</span>
                    <span className="font-bold text-gray-700">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Bell className="mr-2 text-teal-600" size={20}/>
                System Status
            </h3>
            <div className="space-y-4">
                <div className="p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                    <p className="text-sm font-semibold text-gray-800">Quarter 3 Submissions Open</p>
                    <p className="text-xs text-gray-500 mt-1">Submit your Results and Fee Structure by Oct 30.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const DocumentsView: React.FC<{ 
    docs: StudentDocument[], 
    setDocs: Function, 
    addNotification: Function,
    isAdmin?: boolean 
}> = ({ docs, setDocs, addNotification, isAdmin }) => {
  
  const handleUpload = async (file: File, docType: DocumentType): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newDoc: StudentDocument = {
                id: Date.now().toString(),
                type: docType,
                fileName: file.name,
                fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                uploadedAt: new Date(),
                status: isAdmin ? 'verified' : 'pending',
                quarter: QUARTERLY_DOCS.includes(docType) ? Math.ceil((new Date().getMonth() + 1) / 3) : undefined
            };
            
            // Allow multiple for quarterly, single for others
            if (QUARTERLY_DOCS.includes(docType)) {
                 setDocs((prev: StudentDocument[]) => [...prev, newDoc]);
            } else {
                 setDocs((prev: StudentDocument[]) => [...prev.filter(d => d.type !== docType), newDoc]);
            }

            if (!isAdmin) {
                addNotification({
                    id: Date.now().toString(),
                    title: 'Document Submitted',
                    message: `${docType} was uploaded successfully and is pending review.`,
                    type: 'success',
                    isRead: false,
                    timestamp: new Date()
                });
            }
            
            resolve(true);
        }, 500);
    });
  };

  const handleDelete = (id: string) => {
      setDocs(docs.filter(d => d.id !== id));
  };

  const oneTimeDocs = [DocumentType.SRF_FORM, DocumentType.ACCEPTANCE_LETTER, DocumentType.MATRIC_CERT, DocumentType.ID];
  const quarterlyDocs = [DocumentType.FEE_STRUCTURE, DocumentType.ACCOUNT_STATEMENT, DocumentType.RESULTS];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Essential Documents</h2>
            <p className="text-sm text-gray-500 mb-6">Required for initial registration. Upload once per year.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oneTimeDocs.map(type => (
                    <FileUpload 
                        key={type}
                        label={type} 
                        docType={type} 
                        existingFiles={docs.filter(d => d.type === type)}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quarterly Updates</h2>
            <p className="text-sm text-gray-500 mb-6">Submit these every quarter (up to 4 times a year).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quarterlyDocs.map(type => (
                    <FileUpload 
                        key={type}
                        label={type} 
                        docType={type} 
                        existingFiles={docs.filter(d => d.type === type)}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </div>

        {isAdmin && (
             <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Admin Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUpload 
                        label="Proof of Payment (POP)" 
                        docType={DocumentType.POP} 
                        existingFiles={docs.filter(d => d.type === DocumentType.POP)}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                        isAdmin={true}
                    />
                </div>
            </div>
        )}
    </div>
  );
};

const ProfileView: React.FC<{ user: StudentProfile }> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <UserCircle className="mr-2 text-teal-600" />
                        Student Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Full Name</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Student Number</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.studentNumber}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">University</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.university}</p>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Course</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.course} (Year {user.yearOfStudy})</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase">Residential Address</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.residentialAddress}</p>
                    </div>
                    <div className="md:col-span-2">
                         <label className="block text-xs font-medium text-gray-500 uppercase">Email</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.email}</p>
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Users className="mr-2 text-teal-600" />
                        Parent/Guardian Details
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                     <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Father's Name</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.parentDetails.fatherName}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Father's Contact</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.parentDetails.fatherPhone}</p>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Mother's Name</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.parentDetails.motherName}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Mother's Contact</label>
                        <p className="mt-1 text-gray-900 font-medium">{user.parentDetails.motherPhone}</p>
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Wallet className="mr-2 text-teal-600" />
                        Banking Details
                    </h3>
                    <Button variant="secondary" onClick={() => setIsEditing(!isEditing)} className="text-sm py-1 px-3">
                        {isEditing ? 'Cancel' : 'Edit Details'}
                    </Button>
                </div>
                
                {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Bank Name</label>
                            <input type="text" defaultValue={user.bankDetails?.bankName} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Account Number</label>
                            <input type="text" defaultValue={user.bankDetails?.accountNumber} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Branch Code</label>
                            <input type="text" defaultValue={user.bankDetails?.branchCode} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Account Holder</label>
                            <input type="text" defaultValue={user.bankDetails?.accountHolder} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <Button variant="primary" className="w-full md:w-auto" onClick={() => setIsEditing(false)}>Save Changes</Button>
                        </div>
                    </div>
                ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Bank Name</label>
                            <p className="mt-1 text-gray-900">{user.bankDetails?.bankName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Account Number</label>
                            <p className="mt-1 text-gray-900">**** **** **** {user.bankDetails?.accountNumber.slice(-4)}</p>
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Account Holder</label>
                            <p className="mt-1 text-gray-900">{user.bankDetails?.accountHolder}</p>
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Branch</label>
                            <p className="mt-1 text-gray-900">{user.bankDetails?.branchCode}</p>
                        </div>
                    </div>
                )}
             </div>
        </div>
    )
}

const AdminDashboard: React.FC<{ 
    students: StudentProfile[], 
    onSelectStudent: (s: StudentProfile) => void 
}> = ({ students, onSelectStudent }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-gray-900">Administration Portal</h2>
                 <Button variant="primary">Download All Reports</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{students.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Pending Reviews</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">5</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Disbursed This Month</p>
                    <p className="text-2xl font-bold text-teal-600 mt-1">R 450,000</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Student Directory</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Student Name</th>
                                <th className="px-6 py-3 font-medium">University</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                                        <div className="text-xs text-gray-500">{student.studentNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{student.university}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => onSelectStudent(student)}
                                            className="text-teal-600 hover:text-teal-800 font-medium text-xs flex items-center"
                                        >
                                            View Portal <ChevronRight size={14} className="ml-1"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- MAIN LAYOUT ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  
  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [currentView, setCurrentView] = useState<'dashboard' | 'documents' | 'profile' | 'admin_students'>('dashboard');
  const [documents, setDocuments] = useState<StudentDocument[]>(INITIAL_DOCS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  
  // Admin State
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const addNotification = (n: AppNotification) => {
    setNotifications(prev => [n, ...prev]);
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleAdminLogin = () => {
      setUserRole('admin');
      setIsAuthenticated(true);
      setCurrentView('admin_students');
  };

  const handleStudentLogin = () => {
      setUserRole('student');
      setIsAuthenticated(true);
      setCurrentView('dashboard');
  };

  const handleRegister = () => {
      // Logic to process registration would go here
      // For demo, we just log them in as a student
      handleStudentLogin();
  }

  const handleForgotPassword = () => {
      if(!resetEmail) return;
      // Simulate sending email
      setTimeout(() => {
          setResetSent(true);
      }, 1000);
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="mx-auto h-16 w-16 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={40} />
           </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Student Relief Fund</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
             {authMode === 'login' ? 'Secure Portal Access' : authMode === 'register' ? 'Create New Account' : 'Reset Password'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
            <div className="space-y-6">
                
                {authMode === 'login' ? (
                  <>
                     <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                        <button 
                            className="flex-1 py-2 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm"
                            onClick={handleStudentLogin}
                        >
                            Student Login
                        </button>
                        <button 
                             className="flex-1 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900"
                             onClick={handleAdminLogin}
                        >
                            Admin Login
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email / Student Number</label>
                        <div className="mt-1">
                        <input type="text" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="user@example.com" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <button 
                                type="button"
                                onClick={() => {
                                    setAuthMode('forgot-password');
                                    setResetSent(false);
                                    setResetEmail('');
                                }}
                                className="text-xs font-medium text-teal-600 hover:text-teal-500"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="mt-1">
                        <input type="password" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" defaultValue="password" />
                        </div>
                    </div>

                    <div>
                        <Button 
                            variant="primary" 
                            className="w-full"
                            onClick={userRole === 'admin' ? handleAdminLogin : handleStudentLogin}
                        >
                            Sign In
                        </Button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            New student?{' '}
                            <button 
                                onClick={() => setAuthMode('register')} 
                                className="font-medium text-teal-600 hover:text-teal-500"
                            >
                                Register here
                            </button>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                             All new & existing students must register on this portal.
                        </p>
                    </div>
                  </>
                ) : authMode === 'register' ? (
                  <>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                             <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                             </div>
                             <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                             </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student Number</label>
                            <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">University Email</label>
                            <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Create Password</label>
                            <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>

                        <div className="pt-2">
                            <Button 
                                variant="primary" 
                                className="w-full"
                                onClick={handleRegister}
                            >
                                Create Account
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <button 
                                onClick={() => setAuthMode('login')} 
                                className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center justify-center w-full"
                            >
                                <ArrowRight className="w-4 h-4 mr-1 rotate-180"/> Back to Login
                            </button>
                        </div>
                    </div>
                  </>
                ) : (
                    // --- FORGOT PASSWORD VIEW ---
                    <div className="space-y-6">
                        {!resetSent ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <div className="mt-1">
                                        <input 
                                            type="email" 
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" 
                                            placeholder="Enter your registered email"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        We'll send a secure link to reset your password.
                                    </p>
                                </div>

                                <Button 
                                    variant="primary" 
                                    className="w-full"
                                    onClick={handleForgotPassword}
                                    disabled={!resetEmail}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Reset Link
                                </Button>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    If an account exists for <strong>{resetEmail}</strong>, we have sent password reset instructions.
                                </p>
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <button 
                                onClick={() => {
                                    setAuthMode('login');
                                    setResetSent(false);
                                    setResetEmail('');
                                }} 
                                className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center justify-center w-full"
                            >
                                <ArrowRight className="w-4 h-4 mr-1 rotate-180"/> Back to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW STUDENT CONTEXT ---
  if (userRole === 'admin' && selectedStudent) {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-gray-900 text-white h-16 flex items-center px-6 justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setSelectedStudent(null)} className="text-gray-300 hover:text-white">
                        ← Back to List
                    </button>
                    <h1 className="font-bold">Viewing: {selectedStudent.firstName} {selectedStudent.lastName}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="bg-teal-600 px-3 py-1 rounded text-sm hover:bg-teal-700">Approve Application</button>
                    <button className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">Reject</button>
                </div>
            </header>
            <main className="flex-1 p-8 overflow-y-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <ProfileView user={selectedStudent} />
                     <DocumentsView 
                        docs={documents} 
                        setDocs={setDocuments} 
                        addNotification={addNotification} 
                        isAdmin={true} 
                    />
                 </div>
            </main>
        </div>
     )
  }

  // --- AUTHENTICATED LAYOUT (Student & Admin Dashboard) ---
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-center h-20 border-b border-gray-100">
                 <div className="flex items-center space-x-2 text-teal-700 font-bold text-xl">
                    <GraduationCap size={28} />
                    <span>{userRole === 'admin' ? 'Admin Panel' : 'Relief Portal'}</span>
                 </div>
            </div>
            
            <nav className="p-4 space-y-2 mt-4">
                {userRole === 'student' ? (
                    <>
                        <button 
                            onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <LayoutDashboard size={20} className="mr-3" />
                            Dashboard
                        </button>
                        <button 
                            onClick={() => { setCurrentView('documents'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentView === 'documents' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FileText size={20} className="mr-3" />
                            Documents
                        </button>
                        <button 
                            onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentView === 'profile' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <UserCircle size={20} className="mr-3" />
                            My Profile
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => { setCurrentView('admin_students'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentView === 'admin_students' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Users size={20} className="mr-3" />
                        All Students
                    </button>
                )}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <button 
                    onClick={() => {
                        setIsAuthenticated(false);
                        setAuthMode('login');
                        setNotifications(INITIAL_NOTIFICATIONS);
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 md:px-10">
                <button 
                    className="md:hidden text-gray-500"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
                
                <div className="flex-1 flex justify-end items-center space-x-6">
                    {userRole === 'student' && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 hidden md:inline-block">Academic Year 2024</span>
                            <NotificationBell notifications={notifications} markRead={markNotificationRead} />
                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                                {MOCK_STUDENT.firstName[0]}{MOCK_STUDENT.lastName[0]}
                            </div>
                        </div>
                    )}
                    {userRole === 'admin' && (
                         <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase">Administrator Mode</span>
                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
                                AD
                            </div>
                         </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                <div className="max-w-5xl mx-auto">
                    {userRole === 'student' && (
                        <>
                            {currentView === 'dashboard' && <DashboardView user={MOCK_STUDENT} status={ApplicationStatus.PENDING} docs={documents} />}
                            {currentView === 'documents' && <DocumentsView docs={documents} setDocs={setDocuments} addNotification={addNotification} />}
                            {currentView === 'profile' && <ProfileView user={MOCK_STUDENT} />}
                        </>
                    )}
                    
                    {userRole === 'admin' && currentView === 'admin_students' && (
                        <AdminDashboard students={MOCK_STUDENTS_LIST} onSelectStudent={setSelectedStudent} />
                    )}
                </div>
            </main>
        </div>

        {/* Chatbot (Only for Students usually, but we keep it available) */}
        {userRole === 'student' && <ChatAssistant />}
    </div>
  );
};

export default App;