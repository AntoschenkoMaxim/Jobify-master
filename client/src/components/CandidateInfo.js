import Wrapper from '../assets/wrappers/CandidateInfo'

const CandidateInfo = ({ icon, text }) => {
	return (
		<Wrapper>
			<span className='icon'>{icon}</span>
			<span className='text'>{text}</span>
		</Wrapper>
	)
}

export default CandidateInfo
