import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//строим схему пользователя
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Пожалуйста, укажите имя'],
		minlength: 3,
		maxlength: 20,
		trim: true
	},
	// валидируем наш email с помощью установки пакета validator
	email: {
		type: String,
		required: [true, 'Пожалуйста, укажите email'],
		validate: {
			validator: validator.isEmail,
			message: 'Пожалуйста, укажите правильный email'
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Пожалуйста, укажите пароль'],
		minlength: 6,
		select: false,
	},
	lastName: {
		type: String,
		maxlength: 20,
		trim: true,
		default: 'lastName'
	},
	location: {
		type: String,
		maxlength: 20,
		trim: true,
		default: 'my city'
	},
})

UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	})
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

export default mongoose.model('User', UserSchema)