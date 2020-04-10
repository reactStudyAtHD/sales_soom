import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import TableEl from './TableEl';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';

const Sales = () => {
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const currentYear = Number(new Date().getFullYear());
	const currentMonth = Number(new Date().getMonth() + 1);
	// const currentMonth = 5;
	
	// console.log(currentYear, currentMonth);
	
	const fetchData = async () => {
		try {
			setError(null);
			setData(null);
			setLoading(true);
			const response = await axios.get('http://ctk0327.iptime.org:8080/sales', {
				params: {
					saleYear: currentYear,
					saleMonth: currentMonth
				}
			});
			
			const sortedData = response.data.sort((a, b) => Number(a.saleDate.split('-'[2])) > Number(b.saleDate.split('-'[2])) ? -1 : 1);
			setData(sortedData);
		} catch (e) {
			setError(e);
		}
		setLoading(false);
	};
	
	useEffect(() => {
		fetchData();
	}, []);
	
	useEffect(() => {
		if (data === null) return;
		const copyData = [...data];
		setViewData(copyData);
	}, [data]);
	
	const createDate = () => {
		const lastDate = new Date(viewData[viewData.length - 1].saleDate);
		const newDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
		const year = newDate.getFullYear();
		const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
		const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
		
		if (Number(month) !== currentMonth) alert('해당 월이 아닙니다.');
		else {
			const obj = {
				saleDate: `${year}-${month}-${day}`,
				saleYear: year,
				saleMonth: Number(month),
				tableCount: 0,
				cardSales: 0,
				moneySales: 0,
				serviceSales: 0,
				saleId: new Date().getUTCMilliseconds()
			};
			
			setViewData([...viewData, obj]);
		}
	};
	
	const removeDate = id => {
		// setViewData(viewData.filter(item => item.saleId !== id));
		
		const removeViewData = async () => {
			try {
				// setError(null);
				// setData(null);
				// setLoading(true);
				
				const item = data.filter(item => item.saleId === id)[0];
				console.log(item);
				// return;
				
				axios.post('http://ctk0327.iptime.org:8080/sales', item)
					.then(() => fetchData())
					.catch(e => console.error(e));
			} catch (e) {
				setError(e);
				console.error(e)
			}
			setLoading(false);
		};
		removeViewData();
	};
	
	const filterRemovedItem = (id) => {
		let copyViewData = [];
		
		viewData.map(item => {
			if (item.saleId !== id) copyViewData.push(item);
			else {
				copyViewData.push({
					saleId: data.includes(item.saleId) ? item.saleId : null, //뷰단에서 추가한 id는 서버에 없으니까 에러
					saleDate: item.saleDate,
					cardSales: 0,
					moneySales: 0,
					saleMonth: 0,
					saleYear: 0,
					serviceSales: 0,
					tableCount: 0
				})
			}
		});
		console.log(copyViewData);
		return copyViewData
	};
	
	const handleInput = (e, id, objKey) => {
		setViewData(
			viewData.map(item => {
				if (item.saleId === id) {
					return {
						...item,
						[objKey]: e.target.value
					};
				}
				return item;
			})
		);
	};
	
	const calcTotalSales = id => {
		// console.log('calc1');
		let result = 0;
		viewData.map(item => {
			if (item.saleId === id) {
				const sum = Number(item.cardSales) + Number(item.moneySales) + Number(item.serviceSales);
				result = sum;
			}
		});
		return result;
	};
	
	const calcPerSales = id => {
		// console.log('calc2');
		
		let result = 0;
		viewData.map(item => {
			if (item.saleId === id) {
				const perSale = (Number(item.cardSales) + Number(item.moneySales) + Number(item.serviceSales)) / Number(item.tableCount);
				if (perSale > 0) result = perSale;
			}
		});
		return result;
	};
	
	const filterId = () => {
		let result = [];
		viewData.map(item => {
			let revisedId = null;
			data.map(serverItem => {
				if (serverItem.id === item.saleId) revisedId = serverItem.id;
			});
			item.id = revisedId;
			result.push(item);
		});
		return result;
	};
	
	const saveData = () => {
		const saveViewData = async () => {
			try {
				setError(null);
				setData(null);
				setLoading(true);
				axios.post('http://ctk0327.iptime.org:8080/sales', filterId())
					.then(() => fetchData())
					.catch(e => console.error(e));
			} catch (e) {
				setError(e);
			}
			setLoading(false);
		};
		saveViewData();
	};
	
	const formatNumber = (num) => {
		return Number(num).toLocaleString();
	};
	
	if (loading) return <div>로딩중..</div>;
	if (error) return <div>에러가 발생했습니다</div>;
	if (viewData === null || viewData.length === 0) return <div>로딩중..</div>;
	else return (
		<div>
			<div style={{ textAlign: 'center', marginTop: '2vw' }}> {currentYear}년 {currentMonth}월</div>
			<Table responsive style={{ width: '80vw', margin: '2vw auto' }}>
				<thead>
				<tr>
					<th>날짜</th>
					<th>테이블 수</th>
					<th>카드 매출</th>
					<th>현금 매출</th>
					<th>서비스 매출</th>
					<th>총 매출</th>
					<th>객 단가</th>
				</tr>
				</thead>
				<tbody>
				{viewData.map(item => (
					<tr key={item.saleId}>
						<td>{item.saleDate} </td>
						<td>
							<FormControl
								onChange={e => {
									handleInput(e, item.saleId, 'tableCount');
								}}
								size="sm"
								type="number"
								value={item.tableCount}
							/>
						</td>
						<td>
							<FormControl
								onChange={e => {
									handleInput(e, item.saleId, 'cardSales');
								}}
								size="sm"
								type="number"
								value={item.cardSales}
							/>
						</td>
						<td>
							<FormControl
								onChange={e => {
									handleInput(e, item.saleId, 'moneySales');
								}}
								size="sm"
								type="number"
								value={item.moneySales}
							/>
						</td>
						<td>
							<FormControl
								onChange={e => {
									handleInput(e, item.saleId, 'serviceSales');
								}}
								size="sm"
								type="number"
								value={item.serviceSales}
							/>
						</td>
						<td>{calcTotalSales(item.saleId)}</td>
						<td>{calcPerSales(item.saleId)}</td>
						<td
							onClick={() => {
								removeDate(item.saleId);
							}}
						>
							-
						</td>
					</tr>
				))}
				<tr>
					<td onClick={() => createDate()}> +</td>
				</tr>
				<tr>
					<td onClick={() => saveData()}> 저장하기</td>
				</tr>
				</tbody>
			</Table>
		</div>
	);
};

export default React.memo(Sales);
