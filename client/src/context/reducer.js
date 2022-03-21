import { initialState } from "./appContext"

import {
	DISPLAY_ALERT,
	CLEAR_ALERT,

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

} from "./actions"

const reducer = (state, action) => {
	if (action.type === DISPLAY_ALERT) {
		return {
			...state,
			showAlert: true,
			alertType: 'danger',
			alertText: 'Пожалуйста, заполните все поля!',
		}
	}
	if (action.type === CLEAR_ALERT) {
		return {
			...state,
			showAlert: false,
			alertType: '',
			alertText: '',
		}
	}

	if (action.type === SETUP_USER_BEGIN) {
		return { ...state, isLoading: true }
	}
	if (action.type === SETUP_USER_SUCCESS) {
		return {
			...state,
			isLoading: false,
			token: action.payload.token,
			user: action.payload.user,
			userLocation: action.payload.location,
			jobLocation: action.payload.location,
			showAlert: true,
			alertType: 'success',
			alertText: action.payload.alertText,
		}
	}
	if (action.type === SETUP_USER_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === TOGGLE_SIDEBAR) {
		return { ...state, showSidebar: !state.showSidebar }
	}

	if (action.type === LOGOUT_USER) {
		return {
			...initialState,
			user: null,
			token: null,
			userLocation: null,
			jobLocation: null,
		}
	}

	if (action.type === UPDATE_USER_BEGIN) {
		return { ...state, isLoading: true }
	}
	if (action.type === UPDATE_USER_SUCCESS) {
		return {
			...state,
			isLoading: false,
			token: action.payload.token,
			user: action.payload.user,
			userLocation: action.payload.location,
			jobLocation: action.payload.location,
			showAlert: true,
			alertType: 'success',
			alertText: 'Профиль изменен!',
		}
	}

	if (action.type === UPDATE_USER_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === HANDLE_CHANGE) {
		return {
			...state,
			[action.payload.name]: action.payload.value,
		}
	}

	if (action.type === CLEAR_VALUES) {
		const initialState = {
			isEditing: false,
			editJobId: '',
			name: '',
			position: '',
			company: '',
			jobLocation: state.userLocation,
			candidateLocation: state.userLocation,
			courseLocation: state.userLocation,
			jobType: 'все время',
			candidateType: 'Постоянная',
			courseType: 'Удаленная',
			experience: 'отсутствует',
			duration: '3 месяца',
			status: 'declined',
		}
		return {
			...state,
			...initialState
		}
	}

	if (action.type === CREATE_JOB_BEGIN) {
		return {
			...state,
			isLoading: true
		}
	}

	if (action.type === CREATE_JOB_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'Вакансия создана!',
		}
	}

	if (action.type === CREATE_JOB_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === CREATE_CANDIDATE_BEGIN) {
		return {
			...state,
			isLoading: true
		}
	}

	if (action.type === CREATE_CANDIDATE_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'Кандидат создан!',
		}
	}

	if (action.type === CREATE_CANDIDATE_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === CREATE_COURSE_BEGIN) {
		return {
			...state,
			isLoading: true
		}
	}

	if (action.type === CREATE_COURSE_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'Курс создан!',
		}
	}

	if (action.type === CREATE_COURSE_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === GET_JOBS_BEGIN) {
		return {
			...state,
			isLoading: true,
			showAlert: false
		}
	}

	if (action.type === GET_JOBS_SUCCESS) {
		return {
			...state,
			isLoading: false,
			jobs: action.payload.jobs,
			totalJobs: action.payload.totalJobs,
			numOfPages: action.payload.numOfPages
		}
	}

	if (action.type === SET_EDIT_JOB) {
		const job = state.jobs.find((job) => job._id === action.payload.id)
		const { _id, position, company, jobLocation, jobType, status } = job
		return {
			...state,
			isEditing: true,
			editJobId: _id,
			position,
			company,
			jobLocation,
			jobType,
			status,
		}
	}

	if (action.type === DELETE_JOB_BEGIN) {
		return {
			...state,
			isLoading: true,
		}
	}

	if (action.type === EDIT_JOB_BEGIN) {
		return {
			...state,
			isLoading: true,
		}
	}

	if (action.type === EDIT_JOB_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'Вакансия обновлена!'
		}
	}

	if (action.type === EDIT_JOB_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === SHOW_STATS_BEGIN) {
		return {
			...state,
			isLoading: true,
			showAlert: false,
		}
	}

	if (action.type === SHOW_STATS_SUCCESS) {
		return {
			...state,
			isLoading: false,
			stats: action.payload.stats,
			monthlyApplications: action.payload.monthlyApplications,
		}
	}

	if (action.type === CLEAR_FILTERS) {
		return {
			...state,
			search: '',
			searchStatus: 'все',
			searchType: 'все',
			sort: 'новые',
		}
	}

	if (action.type === CHANGE_PAGE) {
		return {
			...state,
			page: action.payload.page,
		}
	}

	if (action.type === HANDLE_CHANGE) {
		return {
			...state,
			page: 1,
			[action.payload.name]: action.payload.value
		}
	}

	throw new Error(`no such action: ${action.type}`)
}

export default reducer