import { createRequire } from "module";

const require = createRequire(import.meta.url);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(
	{
		service: 'gmail',
		auth: {
			user: 'jurusski@gmail.com',
			pass: 'Maxim201920'
		}
	}
);

//отправка
var mailOptions = {
	from: 'jurusski@gmail.com',
	to: 'jarusski_boec@mail.ru',
	subject: 'Привет, вы зарегистрированы на курс!',
	text: 'fdgdfgdfg'
}

transporter.sendMail(mailOptions, function (error, info) {
	if (error) {
		console.log(error)
	} else {
		console.log('email sent' + info.response)
	}
})