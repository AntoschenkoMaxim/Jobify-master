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
		enum: ['отсутствует', 'от 1 до 3', '3 и более'],
		default: 'отсутствует'
	},
	candidateType: {
		type: String,
		enum: ['Постоянная', 'Неполная', 'удаленная', 'интерн'],
		default: 'постоянная'
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