import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Candidate'
import JobInfo from './JobInfo'

const AllCandidate = ({
	_id,
	position,
	name,
	candidateLocation,
	candidateType,
	createdAt,
	experience,
}) => {
	const { showStats } = useAppContext()

	let date = moment(createdAt)
	date = date.format('MMM Do, YYYY')
	return (
		<Wrapper>
			<header>
				<div className='main-icon'>{name.charAt(0)}</div>
				<div className='info'>
					<h5>{position}</h5>
					<p>{name}</p>
				</div>
			</header>
			<div className='content'>
				<div className='content-center'>
					<JobInfo icon={<FaLocationArrow />} text={candidateLocation} />
					<JobInfo icon={<FaCalendarAlt />} text={date} />
					<JobInfo icon={<FaBriefcase />} text={candidateType} />
					<div className={`experience ${experience}`}>{experience}</div>
				</div>
				<footer>
					<div className='actions'>
						<Link
							to='/register'
							className='btn edit-btn'
							onClick={() => showStats()}
						>
							<span>Подробнее</span>
						</Link>
					</div>
				</footer>
			</div>
		</Wrapper>
	)
}

export default AllCandidate