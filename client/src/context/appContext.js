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
	GET_CANDIDATES_BEGIN,
	GET_CANDIDATES_SUCCESS,
	GET_COURSES_BEGIN,
	GET_COURSES_SUCCESS,

	SET_EDIT_JOB,
	DELETE_JOB_BEGIN,
	DELETE_COURSE_BEGIN,
	DELETE_CANDIDATE_BEGIN,

	EDIT_JOB_BEGIN,
	EDIT_JOB_SUCCESS,
	EDIT_JOB_ERROR,
	EDIT_COURSE_BEGIN,
	EDIT_COURSE_SUCCESS,
	EDIT_COURSE_ERROR,
	EDIT_CANDIDATE_BEGIN,
	EDIT_CANDIDATE_SUCCESS,
	EDIT_CANDIDATE_ERROR,

	SHOW_STATS_BEGIN,
	SHOW_STATS_SUCCESS,
	CLEAR_FILTERS,
	CHANGE_PAGE,
	CHANGE_PAGE_CANDIDATE,
	CHANGE_PAGE_COURSE,
	SET_EDIT_COURSE,
	SET_EDIT_CANDIDATE,

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
	jobTypeOptions: ['Промышленность', 'Строительство', 'Сельское хозяйство', 'Образование', 'Наука', 'Соцобеспечение', 'Продажи', 'IT', 'Финансы', 'Органы госуправления', 'Здравохранение', 'Соцобеспечение'],
	jobType: 'IT',
	candidateTypeOptions: ['Промышленность', 'Строительство', 'Сельское хозяйство', 'Образование', 'Наука', 'Соцобеспечение', 'Продажи', 'IT', 'Финансы', 'Органы госуправления', 'Здравохранение', 'Соцобеспечение'],
	candidateType: 'IT',
	courseTypeOptions: ['Промышленность', 'Строительство', 'Сельское хозяйство', 'Образование', 'Наука', 'Соцобеспечение', 'Продажи', 'IT', 'Финансы', 'Органы госуправления', 'Здравохранение', 'Соцобеспечение'],
	courseType: 'IT',

	experienceOptions: ['отсутствует', '1-3 года', '3 года +'],
	experience: 'отсутствует',
	durationOptions: ['1 месяц', '2 месяца', '3 месяца', '4-6 месяцев', '6 и более'],
	duration: '3 месяца',
	statusOptions: ['собеседование', 'стажировка', 'курсы'],
	status: 'курсы',

	search: '',
	searchStatus: 'все',
	searchType: 'все',
	searchDuration: 'все',
	searchExperience: 'все',
	sort: 'новые',
	sortOptions: ['новые', 'старые', 'a-z', 'z-a'],

	jobs: [],
	totalJobs: 0,
	numOfPages: 1,
	page: 1,

	candidates: [],
	totalCandidates: 0,
	numOfPagesCandidates: 1,
	pageCandidates: 1,

	courses: [],
	totalCourses: 0,
	numOfPagesCourses: 1,
	pageCourses: 1,

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

	const getCandidates = async () => {

		const { pageCandidates, search, searchExperience, searchType, sort } = state
		let url = `/candidates?page=${pageCandidates}&experience=${searchExperience}&candidateType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_CANDIDATES_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { candidates, totalCandidates, numOfPagesCandidates } = data
			dispatch({
				type: GET_CANDIDATES_SUCCESS,
				payload: {
					candidates,
					totalCandidates,
					numOfPagesCandidates
				},
			})
		} catch (error) {
			console.log(error.response)
			// logoutUser()
		}
		clearAlert()
	}

	const getCourses = async () => {

		const { pageCourses, search, searchDuration, searchType, sort } = state
		let url = `/courses?page=${pageCourses}&duration=${searchDuration}&courseType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_COURSES_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { courses, totalCourses, numOfPagesCourses } = data
			dispatch({
				type: GET_COURSES_SUCCESS,
				payload: {
					courses,
					totalCourses,
					numOfPagesCourses
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

	const getAllJobsLanding = async () => {

		const { page, search, searchStatus, searchType, sort } = state
		let url = `/auth/landing/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
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
		}
		clearAlert()
	}

	const getAllCourses = async () => {

		const { pageCourses, search, searchDuration, searchType, sort } = state
		let url = `/courses/courses?page=${pageCourses}&duration=${searchDuration}&courseType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_COURSES_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { courses, totalCourses, numOfPagesCourses } = data
			dispatch({
				type: GET_COURSES_SUCCESS,
				payload: {
					courses,
					totalCourses,
					numOfPagesCourses
				},
			})
		} catch (error) {
			console.log(error.response)
			// logoutUser()
		}
		clearAlert()
	}

	const getAllCoursesLanding = async () => {

		const { pageCourses, search, searchDuration, searchType, sort } = state
		let url = `/auth/landing/courses?page=${pageCourses}&duration=${searchDuration}&courseType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_COURSES_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { courses, totalCourses, numOfPagesCourses } = data
			dispatch({
				type: GET_COURSES_SUCCESS,
				payload: {
					courses,
					totalCourses,
					numOfPagesCourses
				},
			})
		} catch (error) {
			console.log(error.response)
			// logoutUser()
		}
		clearAlert()
	}


	const getAllCandidates = async () => {

		const { pageCandidates, search, searchExperience, searchType, sort } = state
		let url = `/candidates/candidates?page=${pageCandidates}&experience=${searchExperience}&candidateType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_CANDIDATES_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { candidates, totalCandidates, numOfPagesCandidates } = data
			dispatch({
				type: GET_CANDIDATES_SUCCESS,
				payload: {
					candidates,
					totalCandidates,
					numOfPagesCandidates
				},
			})
		} catch (error) {
			console.log(error.response)
			// logoutUser()
		}
		clearAlert()
	}


	const getAllCandidatesLanding = async () => {

		const { pageCandidates, search, searchExperience, searchType, sort } = state
		let url = `/auth/landing/candidates?page=${pageCandidates}&experience=${searchExperience}&candidateType=${searchType}&sort=${sort}`
		//фильтруем по статусу, типу, сортировке по дате и от а до я

		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_CANDIDATES_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { candidates, totalCandidates, numOfPagesCandidates } = data
			dispatch({
				type: GET_CANDIDATES_SUCCESS,
				payload: {
					candidates,
					totalCandidates,
					numOfPagesCandidates
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


	const setEditCourse = (id) => {
		dispatch({
			type:
				SET_EDIT_COURSE,
			payload: { id }
		})
	}

	const setEditCandidate = (id) => {
		dispatch({
			type:
				SET_EDIT_CANDIDATE,
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

	const editCourse = async () => {
		dispatch({ type: EDIT_COURSE_BEGIN })
		try {
			const { company, position, courseLocation, courseType, duration } = state

			await authFetch.patch(`/courses/${state.editCourseId}`, {
				company,
				position,
				courseLocation,
				courseType,
				duration
			})
			dispatch({
				type: EDIT_COURSE_SUCCESS,
			})
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response === 401) return
			dispatch({
				type: EDIT_COURSE_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	const editCandidate = async () => {
		dispatch({ type: EDIT_CANDIDATE_BEGIN })
		try {
			const { name, position, candidateLocation, candidateType, experience } = state

			await authFetch.patch(`/candidates/${state.editCandidateId}`, {
				name,
				position,
				candidateLocation,
				candidateType,
				experience
			})
			dispatch({
				type: EDIT_CANDIDATE_SUCCESS,
			})
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response === 401) return
			dispatch({
				type: EDIT_CANDIDATE_ERROR,
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

	const deleteCourse = async (courseId) => {
		dispatch({ type: DELETE_COURSE_BEGIN })
		try {
			await authFetch.delete(`/courses/${courseId}`)
			getCourses()
		} catch (error) {
			logoutUser()
		}
	}

	const deleteCandidate = async (candidateId) => {
		dispatch({ type: DELETE_CANDIDATE_BEGIN })
		try {
			await authFetch.delete(`/candidates/${candidateId}`)
			getCandidates()
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

	const changePageCandidate = (pageCandidates) => {
		dispatch({ type: CHANGE_PAGE_CANDIDATE, payload: { pageCandidates } })
	}

	const changePageCourse = (pageCourses) => {
		dispatch({ type: CHANGE_PAGE_COURSE, payload: { pageCourses } })
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
			getCourses,
			getCandidates,
			getAllJobs,
			getAllCandidates,
			getAllCourses,
			getAllJobsLanding,
			getAllCoursesLanding,
			getAllCandidatesLanding,
			setEditJob,
			setEditCourse,
			setEditCandidate,
			deleteJob,
			deleteCourse,
			deleteCandidate,
			editJob,
			editCourse,
			editCandidate,
			showStats,
			clearFilters,
			changePage,
			changePageCandidate,
			changePageCourse
		}}>
		{children}
	</AppContext.Provider>
}

const useAppContext = () => {
	return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext } 