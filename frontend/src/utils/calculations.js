/**
 * AttendEase - Calculation Utilities
 * Demonstrates: Attendance Percentage & Threshold Alert Logic
 */

export const ATTENDANCE_THRESHOLD = 75;

/**
 * Calculate attendance percentage: (Present / Total) * 100
 * @param {number} present 
 * @param {number} total 
 * @returns {number} Rounded to 1 decimal place
 */
export const calculatePercentage = (present, total) => {
  const p = Number(present) || 0;
  const t = Number(total) || 0;
  if (t <= 0) return 100.0;
  return Number(((p / t) * 100).toFixed(1));
};

/**
 * Determine if attendance is below threshold
 * @param {number} percentage 
 * @param {number} threshold 
 * @returns {boolean}
 */
export const isLowAttendance = (percentage, threshold = ATTENDANCE_THRESHOLD) => {
  return Number(percentage) < threshold;
};

/**
 * Get display label and color status for attendance percentage
 */
export const getAttendanceStatus = (percentage, threshold = ATTENDANCE_THRESHOLD) => {
  if (isLowAttendance(percentage, threshold)) {
    return {
      label: 'Low Attendance',
      variant: 'danger',
      className: 'badge-low-alert',
      message: 'Attendance is below 75% requirement. Academic detention risk!'
    };
  }
  return {
    label: 'Attendance Satisfactory',
    variant: 'success',
    className: 'badge-satisfactory',
    message: 'Attendance fulfills minimum academic attendance criteria.'
  };
};
