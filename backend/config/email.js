const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: 'jpalorwu.com',
    port: 465,
    secure: true,
    auth:   {
        user: 'admin@jpalorwu.com',
        pass: process.env.EMAIL_PASSWORD||'email_password'
    }
});

const sendMail = async (receipient,subject,html)=>{
    // perform validation checks from outside
    const info = await transporter.sendMail({
        from: 'JP Alorwu <admin@jpalorwu.com>',
        to: receipient,
        subject: subject,
        html: html
    })

    console.log("Message sent: "+ info.messageId);

    // await sendMail().catch(e => {
    //     console.log(e);
    //   });
}

async function testMail(){


    const info = await transporter.sendMail({
        from: 'Admin <admin@jpalorwu.com>',
        to: 'afutubaronny@gmail.com',
        subject: 'Testing,testing',
        html: html
    })

    console.log("Message sent: "+ info.messageId);

}

module.exports = {
    sendMail,
    testMail
};