import { useState } from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'


const Profile = () => {
	const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext()

	const [name, setName] = useState(user?.name)
	const [email, setEmail] = useState(user?.email)
	const [lastName, setLastName] = useState(user?.lastName)
	const [location, setLocation] = useState(user?.location)


	const handleSubmit = (e) => {
		e.preventDefault()
		//удалить когда тестируешь
		if (!name || !lastName || !email || !location) {
			displayAlert()
			return
		}
		updateUser({ name, email, lastName, location })
	}

	return <Wrapper>
		<form className='form' onSubmit={handleSubmit}>
			<h3>Профиль</h3>
			{showAlert && <Alert />}
			<div className='form-center'>
				{/* устанавливаем измененные значения в профиле */}
				<FormRow
					type='text'
					labelText='Имя'
					name='name'
					value={name}
					handleChange={(e) => {
						setName(e.target.value)
					}}>
				</FormRow>
				<FormRow
					type='text'
					labelText='Фамилия'
					name='lastName'
					value={lastName}
					handleChange={(e) => {
						setLastName(e.target.value)
					}}>
				</FormRow>
				<FormRow
					type='email'
					labelText='Email'
					name='email'
					value={email}
					handleChange={(e) => {
						setEmail(e.target.value)
					}}>
				</FormRow>
				<FormRow
					type='text'
					labelText='Местонахождение'
					name='location'
					value={location}
					handleChange={(e) => {
						setLocation(e.target.value)
					}}>
				</FormRow>

				<button
					className='btn btn-block'
					type='submit'
					disabled={isLoading}>
					{isLoading ? 'Подождите...' : 'Сохранить'}
				</button>
			</div>
		</form>
	</Wrapper>
}

export default Profile