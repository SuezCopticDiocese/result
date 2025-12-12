import React from 'react';
import { Student } from '../types';
import { Trophy, Calendar, Phone, Award, CheckCircle2 } from 'lucide-react';

interface ResultCardProps {
  student: Student;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ student, onReset }) => {
  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10">
                <Trophy className="w-10 h-10 text-yellow-300" />
             </div>
             <h2 className="text-2xl font-bold mb-1">{student.name}</h2>
             <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
               {student.className}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">تاريخ الميلاد</p>
                  <p className="font-semibold text-gray-800 dir-ltr text-right">{student.birthDate}</p>
                </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800 dir-ltr text-right">***{student.mobile1.slice(-4)}</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             {student.score1 !== undefined && (
                <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-indigo-600" />
                    <span className="font-bold text-gray-700">النتيجة الأولى</span>
                  </div>
                  <span className="text-xl font-extrabold text-indigo-700">{student.score1}</span>
                </div>
             )}
             
             {student.score2 !== undefined && (
                <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-700">النتيجة الثانية</span>
                  </div>
                  <span className="text-xl font-extrabold text-purple-700">{student.score2}</span>
                </div>
             )}

             {student.score1 === undefined && student.score2 === undefined && (
               <div className="text-center p-6 bg-yellow-50 text-yellow-700 rounded-xl">
                 لم يتم رصد درجات لهذا الطالب بعد.
               </div>
             )}
          </div>

          <button 
            onClick={onReset}
            className="w-full mt-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            بحث عن طالب آخر
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;