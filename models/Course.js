import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema({
	company: {
		type: String,
		required: [true, 'Пожалуйста, укажите компанию'],
		maxlength: 50,
	},
	position: {
		type: String,
		required: [true, 'Пожалуйста, укажите название вашей позиции'],
		maxlength: 100,
	},
	duration: {
		type: String,
		enum: ['1 месяц', '2 месяца', '3 месяца', '4-6 месяцев', '6 и более'],
		default: '3 месяца'
	},
	courseType: {
		type: String,
		enum: ['Постоянная', 'Неполная', 'удаленная', 'интерн'],
		default: 'постоянная'
	},
	courseLocation: {
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

export default mongoose.model('Course', CourseSchema)