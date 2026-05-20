import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email configuration missing: skipping email delivery.");
    return null;
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

export const sendEmailToStudents = async (students, subject, text, html) => {
  if (!Array.isArray(students) || students.length === 0) {
    return null;
  }

  const deliveries = students.map((student) => {
    if (!student.user?.email) {
      return Promise.resolve(null);
    }

    const personalizedText = `Hello ${student.user.name},\n\n${text}`;
    return sendEmail({
      to: student.user.email,
      subject,
      text: personalizedText,
      html,
    }).catch((err) => {
      console.error("Email delivery failed for", student.user.email, err);
      return null;
    });
  });

  return Promise.allSettled(deliveries);
};
