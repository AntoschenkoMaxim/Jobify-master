import mongoose from 'mongoose'

const CandidateSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Пожалуйста, укажите имя'],
		maxlength: 50,
	},
	position: {
		type: String,
		required: [true, 'Пожалуйста, укажите название вашей позиции'],
		maxlength: 100,
	},
	experience: {
		type: String,
		enum: ['отсутствует', '1-3 года', '3 года +'],
		default: 'отсутствует'
	},
	candidateType: {
		type: String,
		enum: ['Промышленность', 'Строительство', 'Сельское хозяйство', 'Образование', 'Наука', 'Соцобеспечение', 'Продажи', 'IT', 'Финансы', 'Органы госуправления', 'Здравохранение', 'Соцобеспечение'],
		default: 'IT'
	},
	candidateLocation: {
		type: String,
		default: 'City',
		required: true,
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'Пожалуйста, представьтесь']
	}
}, { timestamps: true })

export default mongoose.model('Candidate', CandidateSchema)