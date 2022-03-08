import React from 'react'
import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {

	const { numOfPages, page, changePage } = useAppContext()

	const nextPage = () => {
		let newPage = page + 1
		if (newPage > numOfPages) {
			//newPage = numOfPages
			//alternative
			newPage = 1
		}
		changePage(newPage)
	}

	const prevPage = () => {
		let newPage = page - 1
		if (newPage < 1) {
			//newPage = 1
			//alternative
			newPage = numOfPages
		}
		changePage(newPage)
	}

	const pages = Array.from({ length: numOfPages }, (_, index) => {
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
							className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
							key={pageNumber}
							// по клику делаем переход на следующую страницу
							onClick={() => changePage(pageNumber)}
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

export default PageBtnContainer