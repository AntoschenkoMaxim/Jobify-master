import { useEffect } from 'react'
import Loading from './Loading'
import Job from './Job'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAppContext } from '../context/appContext'

const JobsContainer = () => {
	const { getJobs, jobs, isLoading, page, totalJobs } = useAppContext()

	useEffect(() => {
		getJobs()
	}, [])

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
		<h5>{totalJobs} Ваканси{jobs.length > 1 && 'я'} найдено</h5>
		<div className='jobs'>
			{jobs.map((job) => {
				return <Job key={job._id} {...job} />
			})}
		</div>
		{/* pagination buttons */}
	</Wrapper>
}

export default JobsContainer