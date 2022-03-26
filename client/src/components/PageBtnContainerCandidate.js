import React from 'react'
import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainerCandidate = () => {

	const { numOfPagesCandidates, pageCandidates, changePageCandidate } = useAppContext()

	const nextPage = () => {
		let newPage = pageCandidates + 1
		if (newPage > numOfPagesCandidates) {
			//newPage = numOfPages
			//alternative
			newPage = 1
		}
		changePageCandidate(newPage)
	}

	const prevPage = () => {
		let newPage = pageCandidates - 1
		if (newPage < 1) {
			//newPage = 1
			//alternative
			newPage = numOfPagesCandidates
		}
		changePageCandidate(newPage)
	}

	const pages = Array.from({ length: numOfPagesCandidates }, (_, index) => {
		return index + 1
	})

	return (
		<Wrapper>
			<button className='prev-btn' onClick={prevPage}>
				<HiChevronDoubleLeft />
				Пред
			</button>
			<div className='btn-container'>
				{pages.map((pageNumber) => {
					return (
						<button
							type='button'
							className={pageNumber === pageCandidates ? 'pageBtn active' : 'pageBtn'}
							key={pageNumber}
							// по клику делаем переход на следующую страницу
							onClick={() => changePageCandidate(pageNumber)}
						>
							{pageNumber}
						</button>
					)
				})}
			</div>
			<button className='next-btn' onClick={nextPage}>
				След
				<HiChevronDoubleRight />
			</button>
		</Wrapper>
	)
}

export default PageBtnContainerCandidate