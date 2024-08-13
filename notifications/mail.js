const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ibn20172016@gmail.com',
      pass: "piqh vewt pclk hjlp" 
    },
  });

module.exports=sendEmail=async(to, subject, text)=>{
  
  const mailOptions = {
    from: 'ibn20172016@gmail.com',
    to,
    subject,
    html:`<h1>${text}</h1>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Example usage:
//sendEmail('mahedi.hasan@brainstation-23.com', 'Gratitude', 'Hey Mehedi, this is Niloy, thank you for your kind help...at last i found a way to solve the problem.');
