import { IoBarChartSharp } from 'react-icons/io5'
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'

const links = [
	{
		id: 1,
		text: 'статистика',
		path: '/',
		icon: <IoBarChartSharp />
	},
	{
		id: 2,
		text: 'все вакансии',
		path: 'all-jobs',
		icon: <MdQueryStats />
	},
	{
		id: 3,
		text: 'добавить вакансию',
		path: 'add-job',
		icon: <FaWpforms />
	},
	{
		id: 4,
		text: 'профиль',
		path: 'profile',
		icon: <ImProfile />
	}
]

export default links