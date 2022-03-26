import React from 'react'
import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainerCourse = () => {

	const { numOfPagesCourses, pageCourses, changePageCourse } = useAppContext()

	const nextPage = () => {
		let newPage = pageCourses + 1
		if (newPage > numOfPagesCourses) {
			//newPage = numOfPages
			//alternative
			newPage = 1
		}
		changePageCourse(newPage)
	}

	const prevPage = () => {
		let newPage = pageCourses - 1
		if (newPage < 1) {
			//newPage = 1
			//alternative
			newPage = numOfPagesCourses
		}
		changePageCourse(newPage)
	}

	const pages = Array.from({ length: numOfPagesCourses }, (_, index) => {
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
							className={pageNumber === pageCourses ? 'pageBtn active' : 'pageBtn'}
							key={pageNumber}
							// по клику делаем переход на следующую страницу
							onClick={() => changePageCourse(pageNumber)}
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

export default PageBtnContainerCourse