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
		enum: ['собеседование', 'стажировка', 'курсы'],
		default: 'курсы'
	},
	jobType: {
		type: String,
		enum: ['Промышленность', 'Строительство', 'Сельское хозяйство', 'Образование', 'Наука', 'Соцобеспечение', 'Продажи', 'IT', 'Финансы', 'Органы госуправления', 'Здравохранение', 'Соцобеспечение'],
		default: 'IT'
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