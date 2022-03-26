import User from "../models/User.js"
import Course from '../models/Course.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import moment from 'moment'

import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
dotenv.config()

const botCourses = new Telegraf(process.env.BOT_TOKEN)

const createCourse = async (req, res) => {
	const { position, company } = req.body

	if (!position || !company) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}
	req.body.createdBy = req.user.userId
	const course = await Course.create(req.body)
	res.status(StatusCodes.CREATED).json({ course })

	const formatData = `	
		Добавлен новый курс:👇
		Компания: ${course.company},
		Должность: ${course.position},
		Длительность: ${course.duration},
		Занятость: ${course.courseType},
		Местонахождение: ${course.courseLocation}
`
	await botCourses.telegram.sendMessage(process.env.CHAT_COURSES_ID, `${formatData}`);
	await botCourses.telegram.sendMessage(process.env.CHAT_ALL_ID, `${formatData}`);
}

const getAllCourses = async (req, res) => {
	const { search, duration, coursesType, sort } = req.query

	const queryObject = {
		createdBy: req.user.userId,
	}
	// поиск по статусу, типу вакансии, поисковой строке
	if (duration && duration !== 'все') {
		queryObject.duration = duration
	}

	if (coursesType && coursesType !== 'все') {
		queryObject.coursesType = coursesType
	}

	if (search) {
		queryObject.position = { $regex: search, $options: 'i' }
	}

	let result = Course.find(queryObject)

	if (sort === 'новые') {
		result = result.sort('-createdAt')
	}

	if (sort === 'старые') {
		result = result.sort('createdAt')
	}

	if (sort === 'a-z') {
		result = result.sort('position')
	}

	if (sort === 'z-a') {
		result = result.sort('-position')
	}
	// pagination
	const pageCourses = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (pageCourses - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const courses = await result
	const totalCourses = await Course.countDocuments(queryObject)
	const numOfPagesCourses = Math.ceil(totalCourses / limit)

	res.status(StatusCodes.OK).json({ courses, totalCourses, numOfPagesCourses })
}

const getAllCoursesWithoutUser = async (req, res) => {
	const { search, duration, coursesType, sort } = req.query

	const queryObject = {

	}
	// поиск по статусу, типу вакансии, поисковой строке
	if (duration && duration !== 'все') {
		queryObject.duration = duration
	}

	if (coursesType && coursesType !== 'все') {
		queryObject.coursesType = coursesType
	}

	if (search) {
		queryObject.position = { $regex: search, $options: 'i' }
	}

	let result = Course.find(queryObject)

	if (sort === 'новые') {
		result = result.sort('-createdAt')
	}

	if (sort === 'старые') {
		result = result.sort('createdAt')
	}

	if (sort === 'a-z') {
		result = result.sort('position')
	}

	if (sort === 'z-a') {
		result = result.sort('-position')
	}
	// pagination
	const pageCourses = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (pageCourses - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const courses = await result
	const totalCourses = await Course.countDocuments(queryObject)
	const numOfPagesCourses = Math.ceil(totalCourses / limit)

	res.status(StatusCodes.OK).json({ courses, totalCourses, numOfPagesCourses })
}

const updateCourse = async (req, res) => {
	const { id: courseId } = req.params
	const { position, company } = req.body

	if (!position || !company) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}

	const course = await Course.findOne({ _id: courseId })

	if (!course) {
		throw new NotFoundError(`Не существует вакансии с таким id: ${courseId}`)
	}

	//check permissions

	checkPermissions(req.user, course.createdBy)

	const updatedCourse = await Course.findOneAndUpdate({ _id: courseId }, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(StatusCodes.OK).json({ updatedCourse })
}

const deleteCourse = async (req, res) => {
	const { id: courseId } = req.params

	const course = await Course.findOne({ _id: courseId })

	if (!course) {
		throw new NotFoundError(`No job with id: ${courseId}`)
	}

	checkPermissions(req.user, course.createdBy)

	await course.remove()
	res.status(StatusCodes.OK).json({ msg: 'Успешно! Курс удален' })

	const formatData = `	
		Удален следующий курс:👇
		Компания: ${course.company},
		Должность: ${course.position},
		Продолжительность: ${course.duration},
		Местонахождение: ${course.courseLocation}
		Отрасль: ${course.courseType}
`
	await botCourses.telegram.sendMessage(process.env.CHAT_COURSES_ID, `${formatData}`);
	await botCourses.telegram.sendMessage(process.env.CHAT_ALL_ID, `${formatData}`);
}

const showStats = async (req, res) => {
	let stats = await candidate.aggregate([
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		//получаем все наши работы, созданные пользователем по id
		{ $group: { _id: '$candidateType', count: { $sum: 1 } } },
		//агрегируем по статусу и получаем количество
	])

	// выводим количество в заголовок
	stats = stats.reduce((acc, curr) => {
		const { _id: title, count } = curr
		acc[title] = count
		return acc
	}, {})

	// задаем дефолтное значение, если не добавят работу
	const defaultStats = {
		pending: stats.pending || 0,
		interview: stats.interview || 0,
		declined: stats.declined || 0,
	}

	let monthlyApplications = await Candidate.aggregate([
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{
			$group: {
				_id: {
					year: {
						$year: '$createdAt',
					},
					month: {
						$month: '$createdAt',
					},
				},
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': -1, '-id.month': -1 } },
		{ $limit: 6 },
	])
	monthlyApplications = monthlyApplications.map((item) => {
		const { _id: { year, month }, count } = item
		const date = moment().month(month - 1).year(year).format('MMM Y')
		return { date, count }
	}).reverse()

	res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createCourse, deleteCourse, getAllCourses, getAllCoursesWithoutUser, updateCourse, showStats }