import { VscGraph } from 'react-icons/vsc'
import { VscPerson } from 'react-icons/vsc'
import { VscOrganization } from 'react-icons/vsc'
import { VscPersonAdd } from 'react-icons/vsc'
import { VscBriefcase } from 'react-icons/vsc'
import { VscFolderLibrary } from 'react-icons/vsc'
import { VscNewFile } from 'react-icons/vsc'
import { VscEmptyWindow } from 'react-icons/vsc'

const links = [
	{
		id: 1,
		text: 'Все вакансии',
		path: '/',
		icon: <VscPerson />
	},
	{
		id: 2,
		text: 'статистика',
		path: 'stats',
		icon: <VscGraph />
	},
	{
		id: 3,
		text: 'Мои вакансии',
		path: 'all-jobs-user',
		icon: <VscBriefcase />
	},
	{
		id: 4,
		text: 'добавить',
		path: 'add-job',
		icon: <VscNewFile />
	},
	{
		id: 5,
		text: 'кандидаты',
		path: 'all-candidates',
		icon: <VscOrganization />
	},
	{
		id: 6,
		text: 'добавить',
		path: 'add-candidate',
		icon: <VscPersonAdd />
	},
	{
		id: 7,
		text: 'курсы',
		path: 'all-courses',
		icon: <VscFolderLibrary />
	},
	{
		id: 8,
		text: 'добавить',
		path: 'add-course',
		icon: <VscEmptyWindow />
	},
	{
		id: 9,
		text: 'профиль',
		path: 'profile',
		icon: <VscPerson />
	},
]

export default links