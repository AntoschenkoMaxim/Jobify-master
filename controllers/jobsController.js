import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

const createJob = async (req, res) => {
	const { position, company } = req.body

	if (!position || !company) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}
	req.body.createdBy = req.user.userId
	const job = await Job.create(req.body)
	res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobs = async (req, res) => {
	const { search, status, jobType, sort } = req.query

	const queryObject = {
		createdBy: req.user.userId,
	}
	// поиск по статусу, типу вакансии, 
	if (status && status !== 'все') {
		queryObject.status = status
	}

	if (jobType && jobType !== 'все') {
		queryObject.jobType = jobType
	}

	if (search) {
		queryObject.position = { $regex: search, $options: 'i' }
	}

	let result = Job.find(queryObject)

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

	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10

	const jobs = await result
	res.status(StatusCodes.OK).json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}

const updateJob = async (req, res) => {
	const { id: jobId } = req.params
	const { company, position } = req.body

	if (!position || !company) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}

	const job = await Job.findOne({ _id: jobId })

	if (!job) {
		throw new NotFoundError(`Не существует вакансии с таким id: ${jobId}`)
	}

	//check permissions

	checkPermissions(req.user, job.createdBy)

	const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(StatusCodes.OK).json({ updatedJob })
}

const deleteJob = async (req, res) => {
	const { id: jobId } = req.params

	const job = await Job.findOne({ _id: jobId })

	if (!job) {
		throw new NotFoundError(`No job with id: ${jobId}`)
	}

	checkPermissions(req.user, job.createdBy)

	await job.remove()
	res.status(StatusCodes.OK).json({ msg: 'Успешно! Вакансия удалена' })
}

const showStats = async (req, res) => {
	let stats = await Job.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		//получаем все наши работы, созданные пользователем по id
		{ $group: { _id: '$status', count: { $sum: 1 } } },
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

	let monthlyApplications = await Job.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
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

export { createJob, deleteJob, getAllJobs, updateJob, showStats }