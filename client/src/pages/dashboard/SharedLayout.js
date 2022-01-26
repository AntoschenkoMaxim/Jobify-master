import { Outlet, Link } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/SharedLayout'
import { Navbar, SmallSidebar, BigSidebar } from '../../components'

// строим нашу страницу из созданных блоков
const SharedLayout = () => {
	return (
		<Wrapper>
			<main className='dashboard'>
				<SmallSidebar />
				<BigSidebar />
				<div>
					<Navbar />
					<div className='dashboard-page'>
						<Outlet />
					</div>
				</div>
			</main>
		</Wrapper>
	)
}

export default SharedLayout