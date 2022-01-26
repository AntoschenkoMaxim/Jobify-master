import Wrapper from "../assets/wrappers/BigSidebar"
import { useAppContext } from "../context/appContext"
import Logo from '../components/Logo'
import NavLinks from './NavLinks'

const BigSidebar = () => {
	const { showSidebar } = useAppContext()
	return (
		<Wrapper>
			{/* если sidebar показывается присваиваем 1 класс, то есть возвращаем true, если нет 2 класса, то есть возвращаем false*/}
			<div className={showSidebar ? 'sidebar-container' : 'sidebar-container show-sidebar'}>
				<div className='content'>
					<header>
						<Logo />
					</header>
					<NavLinks />
				</div>
			</div>
		</Wrapper>
	)
}

export default BigSidebar
