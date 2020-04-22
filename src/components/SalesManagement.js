import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Summary from './Summary';

const SalesManagement = () => {
		const [viewData, setViewData] = useState(null);
		const [data, setData] = useState(null);
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState(null);
		const [currentYear, setCurrentYear] = useState(Number(new Date().getFullYear()));
		const [currentMonth, setCurrentMonth] = useState(Number(new Date().getMonth() + 1));
		// const currentMonth = 2;
	
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
			fetchData();
		}, [currentMonth, currentYear]);
		
		useEffect(() => {
			if (data === null) return;
			const copyData = [...data];
			setViewData(copyData);
		}, [data]);
		
		const createDate = () => {
			const lastDate = viewData.length > 0 ? new Date(viewData[viewData.length - 1].saleDate) : null;
			const newDate = viewData.length > 0 ? new Date(lastDate.setDate(lastDate.getDate() + 1)) : new Date(`${currentYear}-${currentMonth}-01`);
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
					
					const item = data.filter(item => item.saleId === id);
					// return;
					setViewData(viewData.filter(item => item.saleId !== id));
					axios.delete('http://ctk0327.iptime.org:8080/sales', { data: item })
						.then(() => {
							console.log(data);
						})
						.catch(e => console.error(e));
				} catch (e) {
					setError(e);
					console.error(e);
				}
				setLoading(false);
			};
			removeViewData();
		};
		
		const handleInput = (e, id, objKey) => {
			console.log(e.target.value);
			
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
			// return num.toLocaleString();
			// return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return num
		};
		
		const clickPreviousMonth = () => {
			if (currentMonth - 1 < 1) {
				setCurrentYear(currentYear - 1);
				setCurrentMonth(12);
			} else setCurrentMonth(currentMonth - 1);
		};
		
		const clickNextMonth = () => {
			if (currentMonth + 1 > 12) {
				setCurrentYear(currentYear + 1);
				setCurrentMonth(1);
			} else setCurrentMonth(currentMonth + 1);
		};
		
		const getSummary = () => {
			const summaryTableCount = (viewData.reduce((a, b) => a + Number(b['tableCount']), 0)) / viewData.length;
			const summaryCardSales = (viewData.reduce((a, b) => a + Number(b['cardSales']), 0)) / viewData.length;
			const summaryMoneySales = (viewData.reduce((a, b) => a + Number(b['moneySales']), 0)) / viewData.length;
			const summaryServiceSales = (viewData.reduce((a, b) => a + Number(b['serviceSales']), 0)) / viewData.length;
			
			const getPerSale = (b) => {
				const perSale = (Number(b['cardSales']) + Number(b['moneySales']) + Number(b['serviceSales'])) / Number(b['tableCount']);
				return isNaN(perSale) ? 0 : perSale;
			};
			
			const getSales = (b) => {
				return Number(b['cardSales']) + Number(b['moneySales']) + Number(b['serviceSales']);
			};
			
			const summaryTotalPerSales = (viewData.reduce((a, b) => a + getPerSale(b), 0)) / viewData.length;
			const summaryTotalSales = (viewData.reduce((a, b) => a + getSales(b), 0));
			
			return {
				summaryTableCount: isNaN(summaryTableCount) ? 0 : summaryTableCount,
				summaryCardSales: isNaN(summaryCardSales) ? 0 : summaryCardSales,
				summaryMoneySales: isNaN(summaryMoneySales) ? 0 : summaryMoneySales,
				summaryServiceSales: isNaN(summaryServiceSales) ? 0 : summaryServiceSales,
				summaryTotalPerSales: isNaN(summaryTotalPerSales) ? 0 : summaryTotalPerSales,
				summaryTotalSales: isNaN(summaryTotalSales) ? 0 : summaryTotalSales
			};
			
		};
		
		if (loading) return <div>로딩중..</div>;
		if (error) return <div>에러가 발생했습니다</div>;

		else
			return (
				<div>
					<div style={{ textAlign: 'center', marginTop: '2vw' }}>
						<span onClick={clickPreviousMonth}> <ChevronLeftIcon/></span>
						<span>{currentYear}년 {currentMonth}월 </span>
						<span onClick={clickNextMonth}><ChevronRightIcon/> </span>
					</div>
					{viewData !== null && <Summary summary={getSummary()}/>}
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
						{viewData !== null && viewData.map(item => (
							<tr key={item.saleId}>
								<td>{item.saleDate} </td>
								<td>
									<FormControl
										onChange={e => {
											handleInput(e, item.saleId, 'tableCount');
										}}
										size="sm"
										type="number"
										value={formatNumber(item.tableCount)}
									/>
								</td>
								<td>
									<FormControl
										onChange={e => {
											handleInput(e, item.saleId, 'cardSales');
										}}
										size="sm"
										// type="number"
										value={formatNumber(item.cardSales)}
									/>
								</td>
								<td>
									<FormControl
										onChange={e => {
											handleInput(e, item.saleId, 'moneySales');
										}}
										size="sm"
										// type="number"
										value={formatNumber(item.moneySales)}
									/>
								</td>
								<td>
									<FormControl
										onChange={e => {
											handleInput(e, item.saleId, 'serviceSales');
										}}
										size="sm"
										// type="number"
										value={formatNumber(item.serviceSales)}
									/>
								</td>
								<td>{formatNumber(calcTotalSales(item.saleId))}</td>
								<td>{formatNumber(calcPerSales(item.saleId))}</td>
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
	}
;

export default React.memo(SalesManagement);
