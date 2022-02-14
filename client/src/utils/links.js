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
		text: 'статистика',
		path: '/',
		icon: <VscGraph />
	},
	{
		id: 2,
		text: 'вакансии',
		path: 'all-jobs',
		icon: <VscBriefcase />
	},
	{
		id: 3,
		text: 'добавить',
		path: 'add-job',
		icon: <VscNewFile />
	},
	{
		id: 4,
		text: 'кандидаты',
		path: 'all-candidates',
		icon: <VscOrganization />
	},
	{
		id: 5,
		text: 'добавить',
		path: 'add-candidate',
		icon: <VscPersonAdd />
	},
	{
		id: 6,
		text: 'курсы',
		path: 'all-courses',
		icon: <VscFolderLibrary />
	},
	{
		id: 7,
		text: 'добавить',
		path: 'add-course',
		icon: <VscEmptyWindow />
	},
	{
		id: 8,
		text: 'профиль',
		path: 'profile',
		icon: <VscPerson />
	}
]

export default links