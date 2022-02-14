import { useState, useEffect } from 'react'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'

const initialState = {
	name: '',
	email: '',
	password: '',
	isMember: true,
}

const Register = () => {
	const navigate = useNavigate()
	const [values, setValues] = useState(initialState)
	//global state and useNavigate
	const { user, isLoading, showAlert, displayAlert, registerUser, loginUser, setupUser } = useAppContext()

	const toggleMember = () => {
		setValues({ ...values, isMember: !values.isMember })
	}

	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}
	const onSubmit = (e) => {
		e.preventDefault()
		const { name, email, password, isMember } = values
		if (!email || !password || (!isMember && !name)) {
			displayAlert()
			return
		}
		const currentUser = { name, email, password }
		if (isMember) {
			setupUser({
				currentUser,
				endPoint: 'login',
				alertText: 'Вы авторизовались!'
			})
		}
		else {
			setupUser({
				currentUser,
				endPoint: 'register',
				alertText: 'Вы зарегистрированы!'
			})
		}
	}

	useEffect(() => {
		if (user) {
			setTimeout(() => {
				navigate('/')
			}, 3000)
		}
	}, [user, navigate])

	return (<Wrapper className='full-page'>
		<form className='form' onSubmit={onSubmit}>
			<Logo />
			<h3>{values.isMember ? "Авторизация" : "Регистрация"}</h3>
			{showAlert && <Alert />}
			{/* name input */}
			{!values.isMember &&
				< FormRow
					labelText='имя'
					type='text'
					name='name'
					value={values.name}
					handleChange={handleChange} />
			}
			{/* email input */}
			<FormRow
				type='email'
				name='email'
				value={values.email}
				handleChange={handleChange} />

			<FormRow
				labelText='пароль'
				type='password'
				name='password'
				value={values.password}
				handleChange={handleChange} />

			<button type='submit' className='btn btn-block' disabled={isLoading}>
				Войти
			</button>

			<p>
				{values.isMember ? 'Ещё не с нами?' : 'Уже зарегистрированы?'}
				<button type="button" onClick={toggleMember} className='member-btn'>
					{values.isMember ? 'Зарегистрироваться' : 'Войти'}
				</button>
			</p>
		</form>
	</Wrapper>
	)
}

export default Register
