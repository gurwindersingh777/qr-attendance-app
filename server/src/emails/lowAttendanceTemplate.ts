import { LowAttendanceEmailProps } from "../types/lowAttendanceEmail.js";

export const lowAttendanceTemplate = ({
  studentName,
  subjectName,
  subjectCode,
  attendancePercentage,
}: LowAttendanceEmailProps): string => {

  return `
          <h2>Hello ${studentName}</h2>
          <p>Your attendance in <b>${subjectName} : ${subjectCode} </b>is below required threshold.</p>
          <p>Current Attendance : <b>${attendancePercentage.toFixed(2)}%</b></p>
          <p>Please attend upcoming classes.</p>
        `.trim();
}