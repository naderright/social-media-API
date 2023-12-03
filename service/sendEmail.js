// https://www.npmjs.com/package/nodejs-nodemailer-outlook
const nodeoutlook = require('nodejs-nodemailer-outlook')
function sendEmail(dest, message) {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderPassword
        },
        from: process.env.senderEmail,
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,
        text: 'This is text version!',
        attachments: [
            {
                filename: 'text1.txt',
                content: 'hello world!'
            }
        ],
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
}

module.exports = sendEmail




// const nodemailer = require("nodemailer");
// async function sendEmail(dest, message) {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user:process.env.senderEmail, // generated ethereal user
//             pass:process.env.senderPassword, // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//    await transporter.sendMail({
//         from: `"Fred Foo 👻" <${process.env.senderEmail}>`, // sender address
//         to: dest, // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: message, // html body
//     });

// }
