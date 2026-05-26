import nodemailer from "nodemailer";

console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

export const sendEmailToStudents = async (
  students,
  subject,
  text,
  html
) => {
  if (!Array.isArray(students) || students.length === 0) {
    console.log("No eligible students found");
    return;
  }

  console.log("Students count:", students.length);

  for (const student of students) {
    if (!student.user?.email) {
      console.log("Email missing");
      continue;
    }

    try {
      console.log("Sending to:", student.user.email);

      const personalizedText =
        `Hello ${student.user.name},\n\n${text}`;

      const info = await sendEmail({
        to: student.user.email,
        subject,
        text: personalizedText,
        html,
      });

      console.log("Mail sent successfully");
      console.log(info);

    } catch (err) {
      console.log(
        "Email delivery failed for",
        student.user.email
      );

      console.log(err);
    }
  }
};