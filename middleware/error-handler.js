import { StatusCodes } from "http-status-codes"


const errorHandlerMiddleware = (err, req, res, next) => {
	console.log(err.message)
	const defaultError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Что-то пошло не так, попробуйте позже'
	}
	if (err.name === 'ValidationError') {
		defaultError.statusCode = StatusCodes.BAD_REQUEST
		defaultError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(',')
	}
	if (err.code && err.code === 11000) {
		defaultError.statusCode = StatusCodes.BAD_REQUEST
		defaultError.msg = `${Object.keys(err.keyValue)} поле должно быть уникальным`
	}
	res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware

//создали обьект с дефолтной ошибкой 500