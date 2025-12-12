import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { getUniqueClasses } from '../utils/excelParser';
import { Users, User, Calendar, Phone, Search, Lock, AlertTriangle } from 'lucide-react';

interface StudentSearchProps {
  students: Student[];
  onVerified: (student: Student) => void;
}

const StudentSearch: React.FC<StudentSearchProps> = ({ students, onVerified }) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Verification State
  const [birthDateInput, setBirthDateInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const classes = useMemo(() => getUniqueClasses(students), [students]);
  
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => s.className === selectedClass)
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [students, selectedClass]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) {
      setError('يرجى اختيار الطالب أولاً');
      return;
    }

    // Phone Normalization for Input
    const normalizedInputPhone = phoneInput.replace(/\D/g, '');
    
    // Check Phone (Match either mobile1 or mobile2)
    const phoneMatch = 
      (student.mobile1 && student.mobile1.includes(normalizedInputPhone)) || 
      (student.mobile2 && student.mobile2.includes(normalizedInputPhone));

    // Check Date
    // Stored format: dd/mm/yyyy (e.g., 01/01/2019)
    // Input format: yyyy-mm-dd (e.g., 2019-01-01)
    
    let dateMatch = false;

    try {
      if (student.birthDate && birthDateInput) {
        const [sDay, sMonth, sYear] = student.birthDate.split('/').map(part => parseInt(part, 10));
        const [iYear, iMonth, iDay] = birthDateInput.split('-').map(part => parseInt(part, 10));

        if (sDay === iDay && sMonth === iMonth && sYear === iYear) {
          dateMatch = true;
        }
      }
    } catch (err) {
      console.error("Date parsing error", err);
    }
    
    if (phoneMatch && dateMatch) {
      onVerified(student);
    } else {
      setError('البيانات المدخلة غير صحيحة. يرجى التأكد من تاريخ الميلاد ورقم الهاتف المسجل.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">الاستعلام عن النتائج</h2>
        <p className="text-gray-500 mt-2">يرجى اختيار الصف واسم الطالب للبدء</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* Step 1: Select Class */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            الصف الدراسي / المرحلة
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudentId('');
                setError(null);
              }}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-gray-700"
              required
            >
              <option value="">اختر المرحلة...</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Step 2: Select Student */}
        <div className={`space-y-2 transition-opacity duration-300 ${!selectedClass ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            اسم الطالب
          </label>
          <div className="relative">
             <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setError(null);
              }}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-gray-700"
              disabled={!selectedClass}
              required
            >
              <option value="">اختر الطالب...</option>
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Step 3: Verification */}
        {selectedStudentId && (
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-5 animate-fade-in">
             <div className="flex items-center gap-2 text-blue-800 mb-2">
               <Lock className="w-4 h-4" />
               <h3 className="font-bold text-sm">بيانات التحقق</h3>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={birthDateInput}
                  onChange={(e) => setBirthDateInput(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف (المسجل)
                </label>
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right dir-ltr"
                  required
                />
             </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 animate-shake">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedStudentId || !birthDateInput || !phoneInput}
          className={`
            w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all
            ${(!selectedStudentId || !birthDateInput || !phoneInput) 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-l from-blue-600 to-indigo-600 hover:shadow-blue-500/30 active:scale-95'}
          `}
        >
          <span className="flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            عرض النتيجة
          </span>
        </button>
      </form>
    </div>
  );
};

export default StudentSearch;