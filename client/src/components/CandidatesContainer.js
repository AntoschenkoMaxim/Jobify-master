import { useEffect } from 'react'
import Loading from './Loading'
import Candidate from './Candidate'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAppContext } from '../context/appContext'
import PageBtnContainerCandidate from './PageBtnContainerCandidate'

const CandidatesContainer = () => {
	const {
		getCandidates,
		candidates,
		isLoading,
		pageCandidates,
		totalCandidates,
		search,
		searchExperience,
		searchType,
		sort,
		numOfPagesCandidates
	} = useAppContext()

	useEffect(() => {
		getCandidates()
		// eslint-disable-next-line
	}, [pageCandidates, search, searchExperience, searchType, sort])

	if (isLoading) {
		return <Loading center />
	}

	if (candidates.length === 0) {
		return (
			<Wrapper>
				<h2>Кандидаты не найдены</h2>
			</Wrapper>
		)
	}

	return <Wrapper>
		<h5>кандидатов: {totalCandidates}</h5>
		<div className='jobs'>
			{candidates.map((candidate) => {
				return <Candidate key={candidate._id} {...candidate} />
			})}
		</div>
		{numOfPagesCandidates > 1 && <PageBtnContainerCandidate />}
		{/*кнопки пагинации */}
	</Wrapper>
}

export default CandidatesContainer