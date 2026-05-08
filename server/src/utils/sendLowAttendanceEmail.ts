import resend from "../config/resend.js"
import { lowAttendanceTemplate } from "../emails/lowAttendanceTemplate.js";
import { SendLowAttendanceEmailProps } from "../types/LowAttendanceEmail.js";

export const sendLowAttendanceEmail =
  async ({ toEmail, studentName, subjectName, subjectCode, attendancePercentage }:
    SendLowAttendanceEmailProps) => {

    try {
      await resend.emails.send({
        from: process.env.EMAIL_SENDER!,
        to: process.env.NODE_ENV === "development" ? process.env.TEST_EMAIL! : toEmail,
        subject: `⚠️ Low Attendance Alert — ${subjectName} (${attendancePercentage}%)`,
        html: lowAttendanceTemplate({studentName , subjectName , subjectCode , attendancePercentage})
      })
        
    } catch (error) {
      console.log(`Failed to send email to ${toEmail}:`, error);
    }
  }