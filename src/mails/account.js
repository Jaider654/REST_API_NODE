const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

sgMail.send({
    to:'angel.goez@arus.com.co',
    from:'angel.goez@arus.com.co',
    subject:'This is my first creation!!',
    text:'I hope this one actually get to you'
})