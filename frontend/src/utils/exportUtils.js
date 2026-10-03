/**
 * AttendEase - Export Utility
 * Handles client-side CSV and XML downloads conforming to NRD Lab Experiment 6 (attendance.dtd and attendance.xsd)
 */

export const exportToCSV = (data, filename = 'attendance_report.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => `"${val !== null && val !== undefined ? String(val).replace(/"/g, '""') : ''}"`).join(',')
  ).join('\n');

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + '\n' + rows);
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToXML = ({
  institution = 'Department of Computer Science & Engineering',
  academicYear = '2026-2027',
  generatedDate = new Date().toISOString().split('T')[0],
  subject = {},
  records = [],
  filename = 'attendance_report.xml'
}) => {
  const escapeXml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const subjectCode = escapeXml(subject.subject_code || 'CS501');
  const subjectName = escapeXml(subject.subject_name || 'Web Technologies');
  const department = escapeXml(subject.department || 'Computer Science & Engineering');
  const semester = subject.semester || 5;
  const facultyInCharge = escapeXml(subject.faculty_name || subject.faculty_in_charge || 'Dr. Ramesh Kumar');
  const totalClasses = subject.total_classes || subject.total_sessions || (records.length > 0 ? (records[0].total_classes || 1) : 1);
  const totalStudents = records.length;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<!DOCTYPE attendance_report SYSTEM "attendance.dtd">\n`;
  xml += `<attendance_report xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="attendance.xsd">\n`;
  xml += `  <institution>${escapeXml(institution)}</institution>\n`;
  xml += `  <academic_year>${escapeXml(academicYear)}</academic_year>\n`;
  xml += `  <generated_date>${escapeXml(generatedDate)}</generated_date>\n`;
  xml += `  <subject_summary>\n`;
  xml += `    <subject_code>${subjectCode}</subject_code>\n`;
  xml += `    <subject_name>${subjectName}</subject_name>\n`;
  xml += `    <department>${department}</department>\n`;
  xml += `    <semester>${semester}</semester>\n`;
  xml += `    <faculty_in_charge>${facultyInCharge}</faculty_in_charge>\n`;
  xml += `    <total_classes>${totalClasses}</total_classes>\n`;
  xml += `    <total_students>${totalStudents}</total_students>\n`;
  xml += `  </subject_summary>\n`;
  xml += `  <records>\n`;

  records.forEach((rec, idx) => {
    const rollNo = escapeXml(rec.roll_number || rec.rollNumber || `21CS${101 + idx}`);
    const name = escapeXml(rec.student_name || rec.name || `Student ${idx + 1}`);
    const present = Number(rec.total_present ?? rec.present ?? 0);
    const absent = Number(rec.total_absent ?? rec.absent ?? 0);
    const total = present + absent;
    const pct = total > 0 ? ((present / total) * 100).toFixed(1) : (rec.percentage != null ? Number(rec.percentage).toFixed(1) : '100.0');
    const status = Number(pct) < 75 ? 'Low Attendance' : 'Satisfactory';

    xml += `    <record id="${idx + 1}">\n`;
    xml += `      <roll_number>${rollNo}</roll_number>\n`;
    xml += `      <student_name>${name}</student_name>\n`;
    xml += `      <total_present>${present}</total_present>\n`;
    xml += `      <total_absent>${absent}</total_absent>\n`;
    xml += `      <percentage>${pct}</percentage>\n`;
    xml += `      <status>${status}</status>\n`;
    xml += `    </record>\n`;
  });

  xml += `  </records>\n`;
  xml += `</attendance_report>`;

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
