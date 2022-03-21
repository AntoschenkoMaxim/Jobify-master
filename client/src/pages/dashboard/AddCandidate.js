import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddCandidate = () => {
	const {
		isLoading,
		isEditing,
		showAlert,
		displayAlert,
		name,
		position,
		candidateLocation,
		candidateType,
		candidateTypeOptions,
		experience,
		experienceOptions,
		handleChange,
		clearValues,
		createCandidate,
		editCandidate
	} = useAppContext()

	const handleSubmit = e => {
		e.preventDefault()

		if (!name || !position || !candidateLocation) {
			displayAlert()
			return
		}

		if (isEditing) {
			editCandidate()
			return
		}
		createCandidate()
	}

	const handleCandidateInput = (e) => {
		const name = e.target.name
		const value = e.target.value
		handleChange({ name, value })
	}

	return <Wrapper>
		<form className='form'>
			<h3>{isEditing ? 'Редактировать кандидата' : 'Добавить кандидата'}</h3>
			{showAlert && <Alert />}
			<div className='form-center'>
				{/* position */}
				<FormRow
					type='text'
					labelText='Имя'
					name='name'
					value={name}
					handleChange={handleCandidateInput}
				/>
				{/* company */}
				<FormRow
					type='text'
					labelText='Позиция'
					name='position'
					value={position}
					handleChange={handleCandidateInput}
				/>
				{/* location */}
				<FormRow
					type='text'
					labelText='Местонахождение'
					name='candidateLocation'
					value={candidateLocation}
					handleChange={handleCandidateInput}
				/>
				{/* job status */}
				<FormRowSelect
					name="experience"
					labelText='Опыт работы'
					value={experience}
					handleChange={handleCandidateInput}
					list={experienceOptions}
				/>
				{/* job type */}
				<FormRowSelect
					name="candidateType"
					labelText='Занятость'
					value={candidateType}
					handleChange={handleCandidateInput}
					list={candidateTypeOptions}
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