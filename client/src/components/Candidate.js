import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import CandidateInfo from './CandidateInfo'

const Candidate = ({
	_id,
	name,
	position,
	candidateLocation,
	candidateType,
	createdAt,
	experience,
}) => {
	const { setEditCandidate, deleteCandidate } = useAppContext()

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
					<CandidateInfo icon={<FaLocationArrow />} text={candidateLocation} />
					<CandidateInfo icon={<FaCalendarAlt />} text={date} />
					<CandidateInfo icon={<FaBriefcase />} text={candidateType} />
					<div className={`experience ${experience}`}>{experience}</div>
				</div>
				<footer>
					<div className='actions'>
						<Link
							to='/add-candidate'
							className='btn edit-btn'
							onClick={() => setEditCandidate(_id)}
						>
							Изменить
						</Link>
						<button
							type='button'
							className='btn delete-btn'
							onClick={() => deleteCandidate(_id)}
						>
							Удалить
						</button>
					</div>
				</footer>
			</div>
		</Wrapper>
	)
}

export default Candidate