import { VscGraph, VscRootFolderOpened } from 'react-icons/vsc'
import { VscPerson } from 'react-icons/vsc'
import { VscOrganization } from 'react-icons/vsc'
import { VscPersonAdd } from 'react-icons/vsc'
import { VscBriefcase } from 'react-icons/vsc'
import { VscFolderLibrary } from 'react-icons/vsc'
import { VscNewFile } from 'react-icons/vsc'
import { VscEmptyWindow } from 'react-icons/vsc'
import { VscFileSubmodule } from 'react-icons/vsc'
import { VscShield } from 'react-icons/vsc'

const links = [
	{
		id: 1,
		text: 'статистика',
		path: 'stats',
		icon: <VscGraph />
	},
	{
		id: 2,
		text: 'Все вакансии',
		path: '/',
		icon: <VscRootFolderOpened />
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
		text: 'Все кандидаты',
		path: 'all-candidates',
		icon: <VscOrganization />
	},
	{
		id: 6,
		text: 'мои кандидаты',
		path: 'all-candidates-user',
		icon: <VscPerson />
	},
	{
		id: 7,
		text: 'добавить',
		path: 'add-candidate',
		icon: <VscPersonAdd />
	},
	{
		id: 8,
		text: 'Все курсы',
		path: 'all-courses',
		icon: <VscFileSubmodule />
	},
	{
		id: 9,
		text: 'Мои курсы',
		path: 'all-courses-user',
		icon: <VscFolderLibrary />
	},
	{
		id: 10,
		text: 'добавить',
		path: 'add-course',
		icon: <VscEmptyWindow />
	},
	{
		id: 11,
		text: 'профиль',
		path: 'profile',
		icon: <VscShield />
	},
]

export default links