// Foster Community Connect Server
require('dotenv').config()
var nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')
const app = express()
//three new lines
//What is compression and do I need it?
const compression = require("compression");
const _app_folder ='dist/application';
app.use(compression())

let port = process.env.PORT
if (port == null || port == '') {
  port = 3000
}
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN
const route_path = process.env.ROUTE_PATH
const recipient_email_address = process.env.RECIPIENT_EMAIL_ADDRESS

const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})

app.use(cors())

// Serve static files (client side stuff)
app.server.get('*.*', express.static(_app_folder, {?:?}));
//Serve application paths (server side stuff)
app.all('*', function(req,res) {
  res.status(200).sendFile('/', {root: _app_folder});
});

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
})

// https://cofpa-inventory-server.herokuapp.com/mailgun?firstName=John&lastName=Smith&email=junk@humanoriented.com&phone=2&description=food

//mailgun version of transporter
app.get('/mailgun', function(req, res) {
  var name = req.query.firstName + ' ' + req.query.lastName
  var emailAddress = req.query.email
  var phone = req.query.phoneNumber
  var items = req.query.description
  var action = req.query.form_type

  var mailOptions = {
    from: emailAddress,
    to: recipient_email_address,
    subject: action +  ' from ' + name,
    text: name + ' is ' + action + 'ing: '  + items + '\n\n' + name +"'s phone number is " + phone + '\n' + name + "'s email address is " + emailAddress
  }

  mailgun.messages().send(mailOptions, function (error, body) {
    if (error) {
      console.log(error)
      res.send("SMTP log:" + error)
    } else {
      res.send('Congratulations you little genius. Email sent:' + body)
    }
  })
})


// app.get(route_path, function(req, res) {
//   var name = req.query.firstName + ' ' + req.query.lastName
//   var emailAddress = req.query.email
//   var phone = req.query.phoneNumber
//   var items = req.query.description
//   var action = req.query.form_type

//   var mailOptions = {
//     from: emailAddress,
//     to: recipient_email_address,
//     subject: action +  'from ' + name,
//     text: name + ' is ' + action + 'ing: '  + items + '\n\n' + name +"'s phone number is " + phone + '\n' + name + "'s email address is " + emailAddress
//   }

//   transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//       console.log(error)
//       res.send("SMTP log:" + error.data)
//     } else {
//       res.send('Congratulations you little genius. Email sent:' + info.response)
//     }
//   })
// })


app.listen(port)
