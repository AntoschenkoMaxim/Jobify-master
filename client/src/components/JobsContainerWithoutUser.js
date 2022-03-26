import { useEffect } from 'react'
import Loading from './Loading'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAppContext } from '../context/appContext'
import PageBtnContainer from './PageBtnContainer'
import AllJob from './AllJob'

const JobsContainer = () => {
	const {
		getAllJobs,
		jobs,
		isLoading,
		page,
		totalJobs,
		search,
		searchStatus,
		searchType,
		sort,
		numOfPages
	} = useAppContext()

	useEffect(() => {
		getAllJobs()
		// eslint-disable-next-line
	}, [page, search, searchStatus, searchType, sort])

	if (isLoading) {
		return <Loading center />
	}

	if (jobs.length === 0) {
		return (
			<Wrapper>
				<h2>Вакансии не найдены</h2>
			</Wrapper>
		)
	}

	return <Wrapper>
		<h5>Вакансий: {totalJobs}</h5>
		<div className='jobs'>
			{jobs.map((job) => {
				return <AllJob key={job._id} {...job} />
			})}
		</div>
		{numOfPages > 1 && <PageBtnContainer />}
		{/*кнопки пагинации */}
	</Wrapper>
}

export default JobsContainer