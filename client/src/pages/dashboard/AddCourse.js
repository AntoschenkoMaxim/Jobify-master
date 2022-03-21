import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddCandidate = () => {
	const {
		isLoading,
		isEditing,
		showAlert,
		displayAlert,
		company,
		position,
		courseLocation,
		courseType,
		courseTypeOptions,
		duration,
		durationOptions,
		handleChange,
		clearValues,
		createCourse,
		editCourse
	} = useAppContext()

	const handleSubmit = e => {
		e.preventDefault()

		if (!position || !company || !courseLocation) {
			displayAlert()
			return
		}

		if (isEditing) {
			editCourse()
			return
		}
		createCourse()
	}

	const handleCourseInput = (e) => {
		const name = e.target.name
		const value = e.target.value
		handleChange({ name, value })
	}

	return <Wrapper>
		<form className='form'>
			<h3>{isEditing ? 'Редактировать курс' : 'Добавить курс'}</h3>
			{showAlert && <Alert />}
			<div className='form-center'>
				{/* position */}
				<FormRow
					type='text'
					labelText='Компания'
					name='company'
					value={company}
					handleChange={handleCourseInput}
				/>
				{/* company */}
				<FormRow
					type='text'
					labelText='Позиция'
					name='position'
					value={position}
					handleChange={handleCourseInput}
				/>
				{/* location */}
				<FormRow
					type='text'
					labelText='Местонахождение'
					name='courseLocation'
					value={courseLocation}
					handleChange={handleCourseInput}
				/>
				{/* job status */}
				<FormRowSelect
					name="duration"
					labelText='Длительность'
					value={duration}
					handleChange={handleCourseInput}
					list={durationOptions}
				/>
				{/* job type */}
				<FormRowSelect
					name="courseType"
					labelText='Занятость'
					value={courseType}
					handleChange={handleCourseInput}
					list={courseTypeOptions}
				/>

				{/* btn-container */}
				<div className='btn-container'>
					<button
						type='submit'
						className='btn btn-block submit-btn'
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isEditing ? 'Сохранить' : 'Добавить'}
					</button>

					<button
						className='btn btn-block clear-btn'
						onClick={(e) => {
							e.preventDefault()
							clearValues()
						}}
					>
						Очистить
					</button>
				</div>
			</div>
		</form>
	</Wrapper>
}

export default AddCandidate