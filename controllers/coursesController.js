import Course from '../models/Course.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

const createCourse = async (req, res) => {
	const { position, company } = req.body

	if (!position || !company) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}
	req.body.createdBy = req.user.userId
	const course = await Course.create(req.body)
	res.status(StatusCodes.CREATED).json({ course })
}

const getAllCourses = async (req, res) => {
	const { search, experience, candidateType, sort } = req.query

	const queryObject = {
		createdBy: req.user.userId,
	}
	// поиск по статусу, типу вакансии, поисковой строке
	if (experience && experience !== 'все') {
		queryObject.experience = experience
	}

	if (candidateType && candidateType !== 'все') {
		queryObject.candidateType = candidateType
	}

	if (search) {
		queryObject.position = { $regex: search, $options: 'i' }
	}

	let result = Candidate.find(queryObject)

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
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const candidates = await result
	const totalCandidates = await Candidate.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalCandidates / limit)

	res.status(StatusCodes.OK).json({ candidates, totalCandidates, numOfPages })
}

const getAllCoursesWithoutUser = async (req, res) => {
	const { search, experience, candidateType, sort } = req.query

	const queryObject = {
	}
	// поиск по статусу, типу вакансии, поисковой строке
	if (experience && experience !== 'все') {
		queryObject.experience = experience
	}

	if (candidateType && candidateType !== 'все') {
		queryObject.candidateType = candidateType
	}

	if (search) {
		queryObject.position = { $regex: search, $options: 'i' }
	}

	let result = Candidate.find(queryObject)

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
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const candidates = await result
	const totalCandidates = await Candidate.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalCandidates / limit)

	res.status(StatusCodes.OK).json({ candidates, totalCandidates, numOfPages })
}

const updateCourse = async (req, res) => {
	const { id: candidateId } = req.params
	const { name, position } = req.body

	if (!position || !name) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}

	const candidate = await Candidate.findOne({ _id: candidateId })

	if (!candidate) {
		throw new NotFoundError(`Не существует вакансии с таким id: ${candidateId}`)
	}

	//check permissions

	checkPermissions(req.user, candidate.createdBy)

	const updatedCandidate = await Candidate.findOneAndUpdate({ _id: candidateId }, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(StatusCodes.OK).json({ updatedCandidate })
}

const deleteCourse = async (req, res) => {
	const { id: candidateId } = req.params

	const candidate = await Candidate.findOne({ _id: candidateId })

	if (!candidate) {
		throw new NotFoundError(`No job with id: ${candidateId}`)
	}

	checkPermissions(req.user, candidate.createdBy)

	await candidate.remove()
	res.status(StatusCodes.OK).json({ msg: 'Успешно! Вакансия удалена' })
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