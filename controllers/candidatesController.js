import Candidate from '../models/Candidate.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

import { Markup, Telegraf } from 'telegraf'
import dotenv from 'dotenv'
dotenv.config()

const botCandidates = new Telegraf(process.env.BOT_TOKEN)

const createCandidate = async (req, res) => {
	const { position, name } = req.body

	if (!position || !name) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}
	req.body.createdBy = req.user.userId
	const candidate = await Candidate.create(req.body)
	res.status(StatusCodes.CREATED).json({ candidate })

	const formatData = `	
		Добавлен новый кандидат:👇
		Имя: ${candidate.name},
		Должность: ${candidate.position},
		Опыт работы: ${candidate.experience},
		Отрасль: ${candidate.candidateType},
		Местонахождение: ${candidate.candidateLocation}
`
	await botCandidates.telegram.sendMessage(process.env.CHAT_CANDIDATES_ID, `${formatData}`);
	await botCandidates.telegram.sendMessage(process.env.CHAT_ALL_ID, `${formatData}`);
}


const getAllCandidates = async (req, res) => {
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
	const pageCandidates = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (pageCandidates - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const candidates = await result
	const totalCandidates = await Candidate.countDocuments(queryObject)
	const numOfPagesCandidates = Math.ceil(totalCandidates / limit)

	res.status(StatusCodes.OK).json({ candidates, totalCandidates, numOfPagesCandidates })
}

const getAllCandidatesWithoutUser = async (req, res) => {
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
	const pageCandidates = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (pageCandidates - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const candidates = await result
	const totalCandidates = await Candidate.countDocuments(queryObject)
	const numOfPagesCandidates = Math.ceil(totalCandidates / limit)

	res.status(StatusCodes.OK).json({ candidates, totalCandidates, numOfPagesCandidates })
}

const updateCandidate = async (req, res) => {
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

const deleteCandidate = async (req, res) => {
	const { id: candidateId } = req.params

	const candidate = await Candidate.findOne({ _id: candidateId })

	if (!candidate) {
		throw new NotFoundError(`No candidate with id: ${candidateId}`)
	}

	checkPermissions(req.user, candidate.createdBy)

	await candidate.remove()
	res.status(StatusCodes.OK).json({ msg: 'Успешно! Вакансия удалена' })

	const formatData = `	
		Удален следующий кандидат:👇
		Имя: ${candidate.name},
		Должность: ${candidate.position},
		Опыт работы: ${candidate.experience},
		Отрасль: ${candidate.candidateType},
		Местонахождение: ${candidate.candidateLocation}
`
	await botCandidates.telegram.sendMessage(process.env.CHAT_CANDIDATES_ID, `${formatData}`);
	await botCandidates.telegram.sendMessage(process.env.CHAT_ALL_ID, `${formatData}`);
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

export { createCandidate, deleteCandidate, getAllCandidates, getAllCandidatesWithoutUser, updateCandidate, showStats }