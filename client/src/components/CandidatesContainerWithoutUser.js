import { useEffect } from 'react'
import Loading from './Loading'
import AllCandidate from './AllCandidate'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAppContext } from '../context/appContext'
import PageBtnContainerCandidate from './PageBtnContainerCandidate'

const CandidatesContainer = () => {
	const {
		getAllCandidates,
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
		getAllCandidates()
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
				return <AllCandidate key={candidate._id} {...candidate} />
			})}
		</div>
		{numOfPagesCandidates > 1 && <PageBtnContainerCandidate />}
		{/*кнопки пагинации */}
	</Wrapper>
}

export default CandidatesContainer