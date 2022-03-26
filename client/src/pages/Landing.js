import main from '../assets/images/main-alternative.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'
import { Link } from 'react-router-dom'
import { AllJobsLanding, AllCoursesLanding, AllCandidatesLanding } from './dashboard'

const Landing = () => {

	return (
		<Wrapper>
			<nav>
				<Logo />
			</nav>
			<div className='container page'>
				{/* info */}
				<div className='info'>
					<h1>
						job <span>tracking</span> app
					</h1>
					<p>Данный сайт разработан для пользователей, заинтересованных в выборе вакансий для работы,
						поиске сотрудников, а также повышении своей квалификации. Для более удобного использования
						приложения и использования всего функционала перейдите к телеграмм-боту:
						<br></br><a href='https://web.telegram.org/k/#5288942718' rel="noreferrer" target='_blank'>Перейти</a>
					</p>
					{/* Кнопка-ссылка, которая изменяет путь URL к другой странице */}
					<Link to="/register" className='btn btn-hero'>Войти</Link>
				</div>
				<img src={main} alt='search job' className='img main-img' />
			</div>
			<div className='container'>
				<h1>
					Вакансии:
				</h1>
			</div>

			<div className='container'>
				<div>
					<AllJobsLanding />
				</div>
			</div>

			<div className='container'>
				<h1>
					Курсы:
				</h1>
			</div>
			<div className='container'>
				<div >
					<AllCoursesLanding />
				</div>
			</div>

			<div className='container'>
				<h1>
					Кандидаты:
				</h1>
			</div>
			<div className='container '>
				<div >
					<AllCandidatesLanding />
				</div>
			</div>
		</Wrapper>
	)
}



export default Landing

