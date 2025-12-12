import * as XLSX from 'xlsx';
import { Student, HEADER_MAPPING } from '../types';

export const parseExcelFile = async (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with headers
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const students: Student[] = rawData.map((row: any, index) => {
          const student: any = { id: `student-${index}` };

          // Iterate over keys in the row and map them using HEADER_MAPPING
          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim();
            const mappedKey = HEADER_MAPPING[cleanKey] || HEADER_MAPPING[cleanKey.toLowerCase()];
            
            if (mappedKey) {
              let value = row[key];
              
              // Normalize data types
              if (mappedKey === 'mobile1' || mappedKey === 'mobile2') {
                // Ensure phones are strings and remove non-digits
                value = String(value).replace(/\D/g, '');
              } else if (mappedKey === 'birthDate') {
                // Handle Excel dates (serial numbers)
                if (typeof value === 'number') {
                  const date = XLSX.SSF.parse_date_code(value);
                  // Format as M/D/YYYY or D/M/YYYY based on region, 
                  // but we stick to a simple comparison string.
                  // Let's normalize to a comparable string format if possible or keep raw.
                  // For the sake of this simple matcher, we store the raw value for display
                  // and we will handle "fuzzy matching" in the UI logic.
                  value = `${date.m}/${date.d}/${date.y}`;
                } else {
                  value = String(value).trim();
                }
              }
              
              student[mappedKey] = value;
            } else {
              // Keep original if no mapping found (useful for dynamic display?)
              // student[key] = row[key]; 
            }
          });

          // Fallback if mapping failed but keys are somewhat standard English
          if (!student.name && row['name']) student.name = row['name'];
          if (!student.className && (row['class'] || row['Class'])) student.className = row['class'] || row['Class'];
          
          return student as Student;
        }).filter(s => s.name && s.className); // Filter out empty rows

        resolve(students);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const getUniqueClasses = (students: Student[]): string[] => {
  const classes = new Set(students.map(s => s.className));
  return Array.from(classes).sort();
};

export const normalizeDateInput = (input: string): string => {
   // Try to parse YYYY-MM-DD
   const parts = input.split('-');
   if (parts.length === 3) {
     // Return M/D/YYYY to match Excel default parser often used
     // Remove leading zeros for broader compatibility
     return `${parseInt(parts[1])}/${parseInt(parts[2])}/${parseInt(parts[0])}`;
   }
   return input;
}
