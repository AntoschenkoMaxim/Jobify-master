import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import moment from 'moment'

import { Markup, Telegraf } from 'telegraf'
import dotenv from 'dotenv'
dotenv.config()
import commands from '../bot/commandsForBot.js'
import text from '../bot/textForBot.js'

const botJobs = new Telegraf(process.env.BOT_TOKEN)
botJobs.start((ctx) => ctx.reply(`Приветствую вас, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'дорогой незнакомец'}!`))
botJobs.help((ctx) => ctx.reply(commands))
botJobs.command('info', async (ctx) => {
	try {
		await ctx.replyWithHTML('<b>Информация по сайту</b>', Markup.inlineKeyboard(
			[
				[Markup.button.callback('Читать', 'btn_follow')]
			]
		))
	} catch (e) {
		console.error(e)
	}
})

botJobs.command('chats', async (ctx) => {
	try {
		await ctx.replyWithHTML('<b>Похоже вы заинтересованы данной разработкой, выберите чат для дальнейшего продолжения. Чат общий - информирует о добавлении и удалении всех вакансий/курсов/кандидатов. Чат с вакансиями информирует о вакансиях, чат с курсами о курсах, чат с кандидатами о кандидатах соответственно. 👋</b>', Markup.inlineKeyboard(
			[
				[Markup.button.url('Общий', 't.me/+rEzMP3bmUS84Nzgy')],
				[Markup.button.url('Вакансии', 't.me/+IlT14GqWwxAyNzgy')],
				[Markup.button.url('Курсы', 't.me/+FddajcyAKmkxZWM6')],
				[Markup.button.url('Кандидаты', 't.me/+1j3NL7yL3jtkMzRi')],
			]
		))
	} catch (e) {
		console.error(e)
	}
})

function addActionBot(name, src, text) {
	botJobs.action(name, async (ctx) => {
		try {
			await ctx.answerCbQuery()
			if (src !== false) {
				await ctx.replyWithPhoto({
					source: src
				})
			}
			await ctx.replyWithHTML(text, {
				disable_web_page_preview: true
			})
		} catch (e) {
			console.error(e)
		}
	})
}

addActionBot('btn_follow', './img/logo.jpg', text)
botJobs.launch()

const createJob = async (req, res) => {
	const { position, company } = req.body

	if (!position || !company) {
		throw new BadRequestError('Пожалуйста, заполните все поля!')
	}
	req.body.createdBy = req.user.userId
	const job = await Job.create(req.body)
	res.status(StatusCodes.CREATED).json({ job })

	const formatData = `	
		Вышла новая вакансия:👇
		Компания: ${job.company},
		Должность: ${job.position},
		Статус: ${job.status},
		Местонахождение: ${job.jobLocation}
		Занятость: ${job.jobType}
`
	await botJobs.telegram.sendMessage(process.env.CHAT_JOBS_ID, `${formatData}`);
	await botJobs.telegram.sendMessage(process.env.CHAT_ALL_ID, `${formatData}`);
}


const getAllJobs = async (req, res) => {
	const { search, status, jobType, sort } = req.query

	const queryObject = {
		createdBy: req.user.userId,
	}
	// поиск по статусу, типу вакансии, поисковой строке
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
	// pagination
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const jobs = await result
	const totalJobs = await Job.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalJobs / limit)

	res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const getAllJobsWithoutUser = async (req, res) => {
	const { search, status, jobType, sort } = req.query

	const queryObject = {

	}
	// поиск по статусу, типу вакансии, поисковой строке
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
	// pagination
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit
	result = result.skip(skip).limit(limit)
	//125
	// 10 10 10 10 10 10 10 10 10 10 10 10 5

	const jobs = await result
	const totalJobs = await Job.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalJobs / limit)

	res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
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

	const formatData = `	
		Удалена следующая вакансия:👇
		Компания: ${job.company},
		Должность: ${job.position},
		Статус: ${job.status},
		Местонахождение: ${job.jobLocation}
		Занятость: ${job.jobType}
`
	await botJobs.telegram.sendMessage(process.env.CHAT_JOBS_ID, `${formatData}`);
	await botJobs.telegram.sendMessage(process.env.CHAT_ALL_ID, `${formatData}`);
}

const showStats = async (req, res) => {
	let stats = await Job.aggregate([
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
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


export { createJob, deleteJob, getAllJobs, getAllJobsWithoutUser, updateJob, showStats }