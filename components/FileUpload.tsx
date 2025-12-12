import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { Student } from '../types';

interface FileUploadProps {
  onDataLoaded: (students: Student[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const students = await parseExcelFile(file);
      if (students.length === 0) {
        setError('لم يتم العثور على بيانات صالحة في الملف. تأكد من وجود أعمدة "الاسم" و "المرحله".');
      } else {
        onDataLoaded(students);
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء قراءة الملف. يرجى التأكد من أن الملف بصيغة Excel أو CSV صالحة.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div 
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {loading ? (
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          ) : (
            <div className="bg-blue-100 p-4 rounded-full">
              <FileSpreadsheet className="w-10 h-10 text-blue-600" />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-700">رفع ملف النتائج</h3>
            <p className="text-sm text-gray-500">
              قم بسحب وإفلات ملف Excel (.xlsx) أو انقر للاختيار
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          تعليمات تنسيق الملف
        </h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 marker:text-blue-500">
          <li>يجب أن يحتوي الملف على الأعمدة التالية (باللغة العربية):</li>
          <li className="font-medium bg-gray-50 p-2 rounded border border-gray-200 inline-block w-full">
            الاسم، المرحله، تاريخ الميلاد، رقم الموبايل، الدرجة 1 (اختياري)، الدرجة 2 (اختياري)
          </li>
          <li>تأكد من أن البيانات موجودة في الورقة الأولى (Sheet 1).</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;