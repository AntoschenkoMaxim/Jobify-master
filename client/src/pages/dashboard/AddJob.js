import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
	const {
		isLoading,
		isEditing,
		showAlert,
		displayAlert,
		position,
		company,
		jobLocation,
		jobType,
		jobTypeOptions,
		status,
		statusOptions,
		handleChange,
		clearValues,
		createJob
	} = useAppContext()

	const handleSubmit = e => {
		e.preventDefault()

		if (!position || !company || !jobLocation) {
			displayAlert()
			return
		}

		if (isEditing) {
			return
		}
		createJob()
	}

	const handleJobInput = (e) => {
		const name = e.target.name
		const value = e.target.value
		handleChange({ name, value })
	}

	return <Wrapper>
		<form className='form'>
			<h3>{isEditing ? 'Редактировать вакансию' : 'Добавить вакансию'}</h3>
			{showAlert && <Alert />}
			<div className='form-center'>
				{/* position */}
				<FormRow
					type='text'
					labelText='Должность'
					name='position'
					value={position}
					handleChange={handleJobInput}
				/>
				{/* company */}
				<FormRow
					type='text'
					labelText='Компания'
					name='company'
					value={company}
					handleChange={handleJobInput}
				/>
				{/* location */}
				<FormRow
					type='text'
					labelText='Местонахождение'
					name='jobLocation'
					value={jobLocation}
					handleChange={handleJobInput}
				/>
				{/* job status */}
				<FormRowSelect
					name="status"
					labelText='Статус'
					value={status}
					handleChange={handleJobInput}
					list={statusOptions}
				/>
				{/* job type */}
				<FormRowSelect
					name="jobType"
					labelText='Занятость'
					value={jobType}
					handleChange={handleJobInput}
					list={jobTypeOptions}
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

export default AddJob