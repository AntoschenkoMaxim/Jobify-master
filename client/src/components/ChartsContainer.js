import React, { useState } from 'react'
import BarChart from './BarChart'
import AreaChart from './AreaChart'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/ChartsContainer'

export default function ChartsContainer() {
	const [barChart, setBarChart] = useState(true) //устанавливаем состояние через хук useState
	const { monthlyApplications: data } = useAppContext()

	return (
		<Wrapper>
			<h4>Месячная статистика</h4>
			{/* Выбираем тип диаграммы */}
			<button type='button' onClick={() => setBarChart(!barChart)}>
				{barChart ? 'Диаграмма области' : 'Столбчатая диаграмма'}
			</button>
			{/* Выбираем тип диаграммы */}
			{barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
		</Wrapper>
	)
}