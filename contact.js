import nodemailer from 'nodemailer'

const requiredEnvironment = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO']

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ message: 'Method not allowed.' })
  }

  const { name, email, message, _honey: honey } = request.body ?? {}
  if (honey) return response.status(200).json({ success: true })
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return response.status(400).json({ message: 'Name, email and message are required.' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ message: 'Please enter a valid email address.' })
  }

  const missing = requiredEnvironment.filter(key => !process.env[key])
  if (missing.length) {
    console.error('Missing mail configuration:', missing.join(', '))
    return response.status(500).json({ message: 'Mail service is not configured yet.' })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      replyTo: email.trim(),
      subject: `Neue Kontaktanfrage von ${name.trim()}`,
      text: `Name: ${name.trim()}\nE-Mail: ${email.trim()}\n\nNachricht:\n${message.trim()}`,
    })

    return response.status(200).json({ success: true, message: 'Message sent.' })
  } catch (error) {
    console.error('SMTP send failed:', error)
    return response.status(502).json({ message: 'The mail server could not send the message.' })
  }
}
