import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Course'
import JobInfo from './JobInfo'

const AllCourse = ({
	_id,
	position,
	company,
	courseLocation,
	courseType,
	createdAt,
	duration,
}) => {
	const { showStats } = useAppContext()

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
					<JobInfo icon={<FaLocationArrow />} text={courseLocation} />
					<JobInfo icon={<FaCalendarAlt />} text={date} />
					<JobInfo icon={<FaBriefcase />} text={courseType} />
					<div className='duration course'>{duration}</div>
				</div>
				<footer>
					<div className='actions'>
						<Link
							to='/stats'
							className='btn edit-btn'
							onClick={() => showStats()}
						>
							<span>Статистика</span>
						</Link>
					</div>
				</footer>
			</div>
		</Wrapper>
	)
}

export default AllCourse