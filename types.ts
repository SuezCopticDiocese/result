export interface Student {
  id: string;
  name: string;
  className: string;
  birthDate: string; // Stored as normalized string for comparison
  displayBirthDate: string; // Original format for display if needed
  mobile1: string;
  mobile2?: string;
  score1?: string | number;
  score2?: string | number;
  [key: string]: any; // Allow extra columns
}

export interface ParseResult {
  data: Student[];
  classes: string[];
  error?: string;
}

// Arabic to English Header Mapping
export const HEADER_MAPPING: Record<string, string> = {
  'الاسم': 'name',
  'المرحله': 'className',
  'المرحلة': 'className', // Alternative spelling
  'الفصل': 'className',
  'تاريخ الميلاد': 'birthDate',
  'رقم الموبايل': 'mobile1',
  'رقم الهاتف': 'mobile1',
  'موبايل 1': 'mobile1',
  'رقم الموبايل 2': 'mobile2',
  'موبايل 2': 'mobile2',
  'الدرجة 1': 'score1',
  'score 1': 'score1',
  'الدرجة 2': 'score2',
  'score 2': 'score2',
};