import React, { useState, useEffect } from 'react';
import StudentSearch from './components/StudentSearch';
import ResultCard from './components/ResultCard';
import { Student } from './types';
import { GraduationCap } from 'lucide-react';

// Mock Data representing result.xlsx
const MOCK_DATA: Student[] = [
  // Grade 1 (Start 1/1/2019)
  { id: '101', name: 'أحمد محمد علي', className: 'اولي ابتدائي', birthDate: '01/01/2019', displayBirthDate: '01/01/2019', mobile1: '01000000001', score1: 95, score2: 92 },
  { id: '102', name: 'جنى محمود حسن', className: 'اولي ابتدائي', birthDate: '15/05/2019', displayBirthDate: '15/05/2019', mobile1: '01100000001', score1: 98, score2: 96 },
  
  // Grade 2 (Start 1/1/2018)
  { id: '201', name: 'عمر خالد ابراهيم', className: 'تانيه ابتدائي', birthDate: '01/01/2018', displayBirthDate: '01/01/2018', mobile1: '01200000002', score1: 88, score2: 85 },
  { id: '202', name: 'مريم سامي يوسف', className: 'تانيه ابتدائي', birthDate: '20/08/2018', displayBirthDate: '20/08/2018', mobile1: '01500000002', score1: 91, score2: 89 },

  // Grade 3 (Start 1/1/2017)
  { id: '301', name: 'يوسف مصطفى كمال', className: 'تالته ابتدائي', birthDate: '01/01/2017', displayBirthDate: '01/01/2017', mobile1: '01000000003', score1: 94, score2: 90 },

  // Grade 4 (Start 1/1/2016)
  { id: '401', name: 'سلمى عادل امام', className: 'رابعه ابتدائي', birthDate: '01/01/2016', displayBirthDate: '01/01/2016', mobile1: '01100000004', score1: 85, score2: 80 },

  // Grade 5 (Start 1/1/2015)
  { id: '501', name: 'كريم عبد العزيز', className: 'خامسه ابتدائي', birthDate: '01/01/2015', displayBirthDate: '01/01/2015', mobile1: '01200000005', score1: 97, score2: 95 },

  // Grade 6 (Start 1/1/2014)
  { id: '601', name: 'هدى سلطان', className: 'ساته ابتدائي', birthDate: '01/01/2014', displayBirthDate: '01/01/2014', mobile1: '01500000006', score1: 99, score2: 98 },
];

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStep, setCurrentStep] = useState<'search' | 'result'>('search');
  const [resultStudent, setResultStudent] = useState<Student | null>(null);
  const [searchKey, setSearchKey] = useState(0); // Used to reset search form

  useEffect(() => {
    // Load mock data on mount
    setStudents(MOCK_DATA);
  }, []);

  const handleVerified = (student: Student) => {
    setResultStudent(student);
    setCurrentStep('result');
  };

  const resetSearch = () => {
    setResultStudent(null);
    setCurrentStep('search');
  };

  const handleLogout = () => {
    setResultStudent(null);
    setCurrentStep('search');
    setSearchKey(prev => prev + 1); // Force re-render of Search component to clear fields
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-600/20">
               <GraduationCap className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-800">نتيـجتي</h1>
               <p className="text-xs text-gray-500">بوابة النتائج المدرسية</p>
             </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
           >
             تسجيل خروج
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        
        {currentStep === 'search' && (
          <StudentSearch 
            key={searchKey}
            students={students} 
            onVerified={handleVerified}
          />
        )}

        {currentStep === 'result' && resultStudent && (
          <ResultCard 
            student={resultStudent} 
            onReset={resetSearch} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة - نظام إدارة النتائج
        </div>
      </footer>
    </div>
  );
}

export default App;