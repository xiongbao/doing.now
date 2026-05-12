import nodemailer from 'nodemailer'

export async function sendTriggerEmail(): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = parseInt(process.env.SMTP_PORT || '587')
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const fromEmail = process.env.EMAIL_FROM
  const toEmail = process.env.EMAIL_TO
  
  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail || !toEmail) {
    console.error('Email configuration incomplete. Required: SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO')
    return false
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const batteryId = `BATT-${randomNum}`
    
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: `System Notification: Scheduled Battery Performance Analysis [ID: ${batteryId}]`,
      text: 'Automated System Check: Your device battery performance is being analyzed and optimized. No further action is required.',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #2c3e50;">Battery Performance Optimization</h2>
          <p>This is an automated notification regarding your scheduled system maintenance.</p>
          <hr />
          <ul>
            <li><strong>Status:</strong> Analysis in progress</li>
            <li><strong>Task:</strong> Calibration & Background Optimization</li>
            <li><strong>Timestamp:</strong> ${new Date().toUTCString()}</li>
            <li><strong>Reference ID:</strong> ${batteryId}</li>
          </ul>
          <p style="font-size: 12px; color: #7f8c8d;">
            This is a system-generated message. Please do not reply to this email.
          </p>
        </div>
      `
    })
    
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
