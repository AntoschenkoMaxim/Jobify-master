import React, { useReducer, useContext } from 'react'

import reducer from './reducer'
import axios from 'axios'

import {
	CLEAR_ALERT,
	DISPLAY_ALERT,

	SETUP_USER_BEGIN,
	SETUP_USER_SUCCESS,
	SETUP_USER_ERROR,

	TOGGLE_SIDEBAR,
	LOGOUT_USER,

	UPDATE_USER_BEGIN,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_ERROR,

	HANDLE_CHANGE,
	CLEAR_VALUES,

	CREATE_JOB_BEGIN,
	CREATE_JOB_SUCCESS,
	CREATE_JOB_ERROR,

	CREATE_CANDIDATE_BEGIN,
	CREATE_CANDIDATE_SUCCESS,
	CREATE_CANDIDATE_ERROR,

	CREATE_COURSE_BEGIN,
	CREATE_COURSE_SUCCESS,
	CREATE_COURSE_ERROR,

	GET_JOBS_BEGIN,
	GET_JOBS_SUCCESS,

	SET_EDIT_JOB,
	DELETE_JOB_BEGIN,

	EDIT_JOB_BEGIN,
	EDIT_JOB_SUCCESS,
	EDIT_JOB_ERROR,

	SHOW_STATS_BEGIN,
	SHOW_STATS_SUCCESS,
	CLEAR_FILTERS,
	CHANGE_PAGE

} from './actions'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
	isLoading: false,
	showAlert: false,
	alertText: '',
	alertType: '',

	user: user ? JSON.parse(user) : null,
	token: token,
	userLocation: userLocation || '',
	showSidebar: false,

	isEditing: false,
	editJobId: '',
	position: '',
	company: '',
	jobLocation: userLocation || '',
	candidateLocation: userLocation || '',
	courseLocation: userLocation || '',
	jobTypeOptions: ['все время', 'пол ставки', 'удаленная', 'интерн'],
	jobType: 'все время',
	candidateTypeOptions: ['Постоянная', 'Неполная', 'удаленная', 'интерн'],
	candidateType: 'Постоянная',
	courseTypeOptions: ['Постоянная', 'Неполная', 'удаленная', 'интерн'],
	courseType: 'Удаленная',

	experienceOptions: ['отсутствует', 'от 1 до 3', '3 и более'],
	experience: 'отсутствует',
	durationOptions: ['1 месяц', '2 месяца', '3 месяца', '4-6 месяцев', '6 и более'],
	duration: '3 месяца',
	statusOptions: ['interview', 'pending', 'declined'],
	status: 'declined',

	search: '',
	searchStatus: 'все',
	searchType: 'все',
	sort: 'новые',
	sortOptions: ['новые', 'старые', 'a-z', 'z-a'],

	jobs: [],
	totalJobs: 0,
	numOfPagesJobs: 1,
	pageJobs: 1,

	candidates: [],
	totalCandidates: 0,
	numOfPagesCandidates: 1,
	pageCandidates: 1,

	stats: {},
	monthlyApplications: []
}


const AppContext = React.createContext()

const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	//axios
	const authFetch = axios.create({
		baseURL: '/api/v1',
	})
	//request

	authFetch.interceptors.request.use((config) => {
		config.headers.common['Authorization'] = `Bearer ${state.token}`
		return config
	},
		(error) => {
			return Promise.reject(error)
		}
	)
	//response
	authFetch.interceptors.response.use((response) => {
		return response;
	},
		(error) => {
			if (error.response.status === 401) {
				logoutUser()
			}
			return Promise.reject(error)
		}
	)


	const displayAlert = () => {
		dispatch({ type: DISPLAY_ALERT })
		clearAlert()
	}

	const clearAlert = () => {
		setTimeout(() => {
			dispatch({ type: CLEAR_ALERT })
		}, 3000)
	}

	const addUserToLocalStorage = ({ user, token, location }) => {
		localStorage.setItem('user', JSON.stringify(user))
		localStorage.setItem('token', token)
		localStorage.setItem('location', location)
	}

	const removeUserFromLocalStorage = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		localStorage.removeItem('location')
	}

	const setupUser = async ({ currentUser, endPoint, alertText }) => {
		dispatch({ type: SETUP_USER_BEGIN })
		try {
			const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)

			const { user, token, location } = data
			dispatch({
				type: SETUP_USER_SUCCESS,
				payload: { user, token, location, alertText },
			})
			addUserToLocalStorage({ user, token, location })
		} catch (error) {
			dispatch({
				type: SETUP_USER_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	const toggleSidebar = () => {
		dispatch({ type: TOGGLE_SIDEBAR })
	}

	const logoutUser = () => {
		dispatch({ type: LOGOUT_USER })
		removeUserFromLocalStorage()
	}

	const updateUser = async (currentUser) => {
		dispatch({ type: UPDATE_USER_BEGIN })
		try {
			const { data } = await authFetch.patch('/auth/updateUser', currentUser)

			const { user, location, token } = data

			dispatch({
				type: UPDATE_USER_SUCCESS,
				payload: { user, location, token }
			})
			addUserToLocalStorage({ user, location, token })
		} catch (error) {
			if (error.response.status !== 401) {
				dispatch({
					type: UPDATE_USER_ERROR,
					payload: { msg: error.response.data.msg }
				})
			}
		}
		clearAlert()
	}

	const handleChange = ({ name, value }) => {
		dispatch({
			type: HANDLE_CHANGE,
			payload: { name, value }
		})
	}

	const clearValues = () => {
		dispatch({ type: CLEAR_VALUES })
	}

	const createJob = async () => {
		dispatch({ type: CREATE_JOB_BEGIN })
		try {
			const { position, company, jobLocation, jobType, status } = state
			await authFetch.post('/jobs', {
				position,
				company,
				jobLocation,
				jobType,
				status,
			})
			dispatch({ type: CREATE_JOB_SUCCESS })
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response.status === 401) return
			dispatch({
				type: CREATE_JOB_ERROR,
				payload: { msg: error.response.data.msg }
			})
		}
		clearAlert()
	}

	const createCandidate = async () => {
		dispatch({ type: CREATE_CANDIDATE_BEGIN })
		try {
			const { name, position, experience, candidateType, candidateLocation } = state
			await authFetch.post('/candidates', {
				name,
				position,
				experience,
				candidateType,
				candidateLocation,
			})
			dispatch({ type: CREATE_CANDIDATE_SUCCESS })
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response.status === 401) return
			dispatch({
				type: CREATE_CANDIDATE_ERROR,
				payload: { msg: error.response.data.msg }
			})
		}
		clearAlert()
	}

	const createCourse = async () => {
		dispatch({ type: CREATE_COURSE_BEGIN })
		try {
			const { company, position, duration, courseType, courseLocation } = state
			await authFetch.post('/courses', {
				company,
				position,
				duration,
				courseType,
				courseLocation,
			})
			dispatch({ type: CREATE_COURSE_SUCCESS })
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response.status === 401) return
			dispatch({
				type: CREATE_COURSE_ERROR,
				payload: { msg: error.response.data.msg }
			})
		}
		clearAlert()
	}

	const getJobs = async () => {

		const { page, search, searchStatus, searchType, sort } = state
		let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_JOBS_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { jobs, totalJobs, numOfPages } = data
			dispatch({
				type: GET_JOBS_SUCCESS,
				payload: {
					jobs,
					totalJobs,
					numOfPages
				},
			})
		} catch (error) {
			console.log(error.response)
			// logoutUser()
		}
		clearAlert()
	}

	const getAllJobs = async () => {

		const { page, search, searchStatus, searchType, sort } = state
		let url = `/jobs/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_JOBS_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { jobs, totalJobs, numOfPages } = data
			dispatch({
				type: GET_JOBS_SUCCESS,
				payload: {
					jobs,
					totalJobs,
					numOfPages
				},
			})
		} catch (error) {
			console.log(error.response)
			// logoutUser()
		}
		clearAlert()
	}

	const setEditJob = (id) => {
		dispatch({
			type:
				SET_EDIT_JOB,
			payload: { id }
		})
	}

	const editJob = async () => {
		dispatch({ type: EDIT_JOB_BEGIN })
		try {
			const { position, company, jobLocation, jobType, status } = state

			await authFetch.patch(`/jobs/${state.editJobId}`, {
				company,
				position,
				jobLocation,
				jobType,
				status
			})
			dispatch({
				type: EDIT_JOB_SUCCESS,
			})
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response === 401) return
			dispatch({
				type: EDIT_JOB_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	const deleteJob = async (jobId) => {
		dispatch({ type: DELETE_JOB_BEGIN })
		try {
			await authFetch.delete(`/jobs/${jobId}`)
			getJobs()
		} catch (error) {
			logoutUser()
		}
	}

	const showStats = async () => {
		dispatch({ type: SHOW_STATS_BEGIN })
		try {
			const { data } = await authFetch('/jobs/stats')
			dispatch({
				type: SHOW_STATS_SUCCESS,
				payload: {
					stats: data.defaultStats,
					monthlyApplications: data.monthlyApplications,
				},
			})
		} catch (error) {
			//loadoutUser()
		}
		clearAlert()
	}

	const clearFilters = () => {
		dispatch({ type: CLEAR_FILTERS })
	}

	const changePage = (page) => {
		dispatch({ type: CHANGE_PAGE, payload: { page } })
	}

	return <AppContext.Provider
		value={{
			...state,
			displayAlert,
			setupUser,
			toggleSidebar,
			logoutUser,
			updateUser,
			handleChange,
			clearValues,
			createJob,
			createCandidate,
			createCourse,
			getJobs,
			getAllJobs,
			setEditJob,
			deleteJob,
			editJob,
			showStats,
			clearFilters,
			changePage
		}}>
		{children}
	</AppContext.Provider>
}

const useAppContext = () => {
	return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext } 