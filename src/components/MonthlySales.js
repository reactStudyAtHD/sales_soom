import React, { useEffect, useState } from 'react';

// docs - https://github.com/wojtekmaj/react-calendar#readme
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const MonthlySales = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentYear, setCurrentYear] = useState(Number(new Date().getFullYear()));
	const [currentMonth, setCurrentMonth] = useState(Number(new Date().getMonth() + 1));
	const date = new Date();
	
	const fetchData = async (year, month) => {
		try {
			const response = await axios.get('http://ctk0327.iptime.org:8080/sales', {
				params: {
					saleYear: year,
					saleMonth: month
				}
			});
			console.log('response: ', response);
			const sortedData = response.data.sort((a, b) => Number(a.saleDate.split('-'[2])) > Number(b.saleDate.split('-'[2])) ? -1 : 1);
			setData(sortedData);
		} catch (e) {
			setError(e);
			console.log(e);
		}
		setLoading(false);
	};
	
	useEffect(() => {
		fetchData(currentYear, currentMonth);
	}, [currentYear, currentMonth]);
	
	useEffect(() => {
		console.log(data);
	}, [data]);
	
	const onClickDay = (e, tile) => {
		const clickedDate = new Date(e).getDate();
		// data.map(item => {
		// 	if (Number(item.saleDate.split('-')[2]) === clickedDate) console.log(item);
		// });
		// console.log('this', tile);
		
	};
	
	const calcTotalSales = id => {
		let result = 0;
		data.map(item => {
			if (item.saleId === id) {
				const sum = Number(item.cardSales) + Number(item.moneySales) + Number(item.serviceSales);
				result = sum;
			}
		});
		return result;
	};
	
	const calcPerSales = id => {
		let result = 0;
		data.map(item => {
			if (item.saleId === id) {
				const perSale = (Number(item.cardSales) + Number(item.moneySales) + Number(item.serviceSales)) / Number(item.tableCount);
				if (perSale > 0) result = perSale;
			}
		});
		return result;
	};
	
	const test = (date) => {
		const calendarYear = new Date(date).getFullYear();
		const calendarMonth = new Date(date).getMonth();
		// const calendarDate = new Date(date).getDate();
		
		return (
			data.map(item => {
				if (new Date(item.saleDate).getDate() === new Date(date).getDate()) {
					if (new Date(date).getMonth() !== new Date(item.saleDate).getMonth()) return;
					return (
						<p className="salesText">총 매출: {calcTotalSales(item.saleId)} <br/> 객 단가 : {calcPerSales(item.saleId)}</p>
					);
				}
			}));
	};
	return (
		<div>
			<Calendar
				value={date}
				locale="ko"
				defaultView="month"
				onClickDay={(e, tileContent) => onClickDay(e, tileContent)}
				tileContent={({ date }) => data !== null && test(date)}
			/>
		</div>
	);
};

export default React.memo(MonthlySales);
