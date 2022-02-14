import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
	company: {
		type: String,
		required: [true, 'Пожалуйста, укажите компанию'],
		maxlength: 50,
	},
	position: {
		type: String,
		required: [true, 'Пожалуйста, укажите название вакансии'],
		maxlength: 100,
	},
	status: {
		type: String,
		enum: ['собеседование', 'в обработке', 'добавлено'],
		default: 'добавлено'
	},
	jobType: {
		type: String,
		enum: ['все время', 'пол ставки', 'удаленная', 'интерн'],
		default: 'все время'
	},
	jobLocation: {
		type: String,
		default: 'my city',
		required: true,
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'Пожалуйста, представьтесь']
	}
}, { timestamps: true })

export default mongoose.model('Job', JobSchema)