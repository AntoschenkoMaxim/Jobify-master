import { useEffect } from 'react'
import Loading from './Loading'
import AllCourse from './AllCourse'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAppContext } from '../context/appContext'
import PageBtnContainerCourse from './PageBtnContainerCourse'

const CoursesContainerWithoutUser = () => {
	const {
		getAllCourses,
		courses,
		isLoading,
		pageCourses,
		totalCourses,
		search,
		searchDuration,
		searchType,
		sort,
		numOfPagesCourses
	} = useAppContext()

	useEffect(() => {
		getAllCourses()
		// eslint-disable-next-line
	}, [pageCourses, search, searchDuration, searchType, sort])

	if (isLoading) {
		return <Loading center />
	}

	if (courses.length === 0) {
		return (
			<Wrapper>
				<h2>Курсы не найдены</h2>
			</Wrapper>
		)
	}

	return <Wrapper>
		<h5>курсов: {totalCourses}</h5>
		<div className='jobs'>
			{courses.map((course) => {
				return <AllCourse key={course._id} {...course} />
			})}
		</div>
		{numOfPagesCourses > 1 && <PageBtnContainerCourse />}
		{/*кнопки пагинации */}
	</Wrapper>
}

export default CoursesContainerWithoutUser