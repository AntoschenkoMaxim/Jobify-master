import main from '../assets/images/main-alternative.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'
import { Link } from 'react-router-dom'

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
					<p>I'm baby photo booth ethical hell of mixtape synth ramps.
						Pok pok ramps meh craft beer flannel, godard post-ironic
						lo-fi gastropub retro prism synth occupy blue bottle hoodie.
						Enamel pin cold-pressed ethical four dollar toast lo-fi,
						hoodie 90's kombucha actually street art kitsch migas cred.
					</p>
					{/* Кнопка-ссылка, которая изменяет путь URL к другой странице */}
					<Link to="/register" className='btn btn-hero'>Войти</Link>
				</div>
				<img src={main} alt='search job' className='img main-img' />
			</div>
		</Wrapper>
	)
}



export default Landing

