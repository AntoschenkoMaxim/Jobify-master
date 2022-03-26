import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import CourseInfo from './CourseInfo'

const Course = ({
	_id,
	position,
	company,
	courseLocation,
	courseType,
	createdAt,
	duration,
}) => {
	const { setEditCourse, deleteCourse } = useAppContext()

	let date = moment(createdAt)
	date = date.format('MMM Do, YYYY')
	return (
		<Wrapper>
			<header>
				<div className='main-icon'>{company.charAt(0)}</div>
				<div className='info'>
					<h5>{position}</h5>
					<p>{company}</p>
				</div>
			</header>
			<div className='content'>
				<div className='content-center'>
					<CourseInfo icon={<FaLocationArrow />} text={courseLocation} />
					<CourseInfo icon={<FaCalendarAlt />} text={date} />
					<CourseInfo icon={<FaBriefcase />} text={courseType} />
					<div className='duration course'>{duration}</div>
				</div>
				<footer>
					<div className='actions'>
						<Link
							to='/add-course'
							className='btn edit-btn'
							onClick={() => setEditCourse(_id)}
						>
							Изменить
						</Link>
						<button
							type='button'
							className='btn delete-btn'
							onClick={() => deleteCourse(_id)}
						>
							Удалить
						</button>
					</div>
				</footer>
			</div>
		</Wrapper >
	)
}

export default Course