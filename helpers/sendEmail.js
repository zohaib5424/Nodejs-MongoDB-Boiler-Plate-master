import { createTransport } from 'nodemailer';
export async function sendEmail(email, subject, html) {
  let response;
  let transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  let mailOptions = {
    from: 'no-reply@creditbutterfly.ai',
    to: email,
    subject: subject,
    html: html,
    fromName: 'Creditbutterfly',
  };
  await transporter
    .sendMail(mailOptions)
    .then(data => {
      // console.log('data ', data);
      response = true;
    })
    .catch(err => {
      // console.log('err ', err);
      response = false;
    });
  return response;
}
