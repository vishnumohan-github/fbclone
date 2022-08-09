const nodemailer = require('nodemailer');

module.exports= async(email,subject,link) => {
try{
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth:{
            user: 'austereinfosolutions@gmail.com',
            pass: process.env.PASSWORD
        },
        // tls:{
        //     rejectUnauthorized: false
        // }
    });
    var mailOptions = {
        from: '"Forget password link"<austereinfosolutions@gmail.com>',
        to: email,
        subject: 'reset-password',
        html: `<h2>please change your password by click the below link</h2>
               
                <a href=${link}>please click here to reset your password</a>
                `
    };

    await transport.sendMail(mailOptions);
    console.log('mail has sent')
}catch(err){
    console.log(err);
}

}