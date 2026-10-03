/**
 * AttendEase - Client-side Form Validation
 * Demonstrates: NRD Lab Experiment 3 (Form Validation with Friendly Error Messages)
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required.';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) return 'Please enter a valid email address.';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return '';
};

export const validateStudentForm = (values) => {
  const errors = {};
  if (!values.name || !values.name.trim()) errors.name = 'Student full name is required.';
  if (!values.rollNumber || !values.rollNumber.trim()) errors.rollNumber = 'Roll number is required.';
  
  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  if (values.phone && !/^[0-9]{10}$/.test(values.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Phone number must be a valid 10-digit number.';
  }

  if (!values.department || !values.department.trim()) errors.department = 'Department is required.';
  if (!values.year) errors.year = 'Academic year is required.';
  if (!values.section || !values.section.trim()) errors.section = 'Section is required.';

  return errors;
};

export const validateFacultyForm = (values) => {
  const errors = {};
  if (!values.name || !values.name.trim()) errors.name = 'Faculty name is required.';
  if (!values.employeeId || !values.employeeId.trim()) errors.employeeId = 'Employee ID is required.';
  
  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  if (values.phone && !/^[0-9]{10}$/.test(values.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Phone number must be a valid 10-digit number.';
  }

  if (!values.department || !values.department.trim()) errors.department = 'Department is required.';
  return errors;
};

export const validateSubjectForm = (values) => {
  const errors = {};
  if (!values.subjectCode || !values.subjectCode.trim()) errors.subjectCode = 'Subject code is required.';
  if (!values.subjectName || !values.subjectName.trim()) errors.subjectName = 'Subject name is required.';
  if (!values.department || !values.department.trim()) errors.department = 'Department is required.';
  if (!values.semester) errors.semester = 'Semester is required.';
  return errors;
};
