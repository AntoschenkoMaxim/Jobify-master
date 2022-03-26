import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
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


const register = async (req, res) => {
	const { name, email, password } = req.body

	if (!name || !email || !password) {
		throw new BadRequestError('Пожалуйста, заполните все поля')
	}
	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		throw new BadRequestError('Данный email уже используется!')
	}
	const user = await User.create({ name, email, password })

	const token = user.createJWT()
	res.status(StatusCodes.CREATED).json({
		user: { email: user.email, lastName: user.lastName, location: user.location, name: user.name },
		token, location: user.location
	})

	//отправка приветствия на почту
	const mailOptions = {
		from: 'jurusski@gmail.com',
		to: user.email,
		subject: 'Jobify!',
		text: `Приветствую вас, ${user.name} ${user.lastName}. Вы успешно прошли регистрацию на сайте Jobify. Удачной работы!`
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('email sent' + info.response)
		}
	})
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new BadRequestError('Заполните все поля!')
	}

	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		throw new UnAuthenticatedError('Неверно введены данные!')
	}
	const isPasswordCorrect = await user.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new UnAuthenticatedError('Неверно введены данные!')
	}

	const token = user.createJWT()

	user.password = undefined

	res.status(StatusCodes.OK).json({ user, token, location: user.location })

}

const updateUser = async (req, res) => {
	const { email, name, lastName, location } = req.body
	if (!email || !name || !lastName || !location) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}
	const user = await User.findOne({ _id: req.user.userId })

	user.email = email
	user.name = name
	user.lastName = lastName
	user.location = location

	await user.save()

	const token = user.createJWT()

	res.status(StatusCodes.OK).json({ user, token, location: user.location })

	//отправка
	const mailOptions = {
		from: 'jurusski@gmail.com',
		to: user.email,
		subject: 'Jobify!',
		text: `Приветствую вас, ${name} ${lastName}! 
		Вы успешно изменили свой профиль. 
		Ваше местоположение: ${location}. 
		Email: ${email}.`
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('email sent' + info.response)
		}
	})
}

export { register, login, updateUser }