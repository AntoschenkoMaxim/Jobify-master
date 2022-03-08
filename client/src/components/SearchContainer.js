import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'

const SearchContainer = () => {
	const {
		isLoading,
		search,
		searchStatus,
		searchType,
		sort,
		sortOptions,
		statusOptions,
		jobTypeOptions,
		handleChange,
		clearFilters
	} = useAppContext()

	const handleSearch = (e) => {
		if (isLoading) return
		handleChange({ name: e.target.name, value: e.target.value })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		clearFilters()
	}

	return (
		<Wrapper>
			<form className='form'>
				<h4> Форма поиска </h4>
				{/* позиционирование строки поиска */}
				<div className='form-center'>
					{/* строка поиска */}
					<FormRow
						type='text'
						name='search'
						labelText='поиск'
						value={search}
						handleChange={handleSearch}
					>
					</FormRow>
					{/* выбор поиска по статусу */}
					<FormRowSelect
						labelText='Статус'
						name='searchStatus'
						value={searchStatus}
						handleChange={handleSearch}
						list={['все', ...statusOptions]}
					>
					</FormRowSelect>
					{/* выбор поиска по типу */}
					<FormRowSelect
						labelText='Тип'
						name='searchType'
						value={searchType}
						handleChange={handleSearch}
						list={['все', ...jobTypeOptions]}
					></FormRowSelect>
					{/* сортировка */}
					<FormRowSelect
						labelText='Сортировка'
						name='sort'
						value={sort}
						handleChange={handleSearch}
						list={sortOptions}
					></FormRowSelect>
					<button
						className='btn btn-block btn-danger'
						disabled={isLoading}
						onClick={handleSubmit}
					>
						Очистить
					</button>
				</div>
			</form>
		</Wrapper>
	)
}

export default SearchContainer
