import React from 'react';

const Summary = ({ summary }) => {
	const { summaryTableCount, summaryCardSales, summaryMoneySales, summaryServiceSales, summaryTotalPerSales, summaryTotalSales } = summary;
	const formatNumber = (num) => {
		// return num.toLocaleString();
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};
	
	return (
		<>
			<div style={{ textAlign: 'center', marginTop: '2vw' }}>
				평균 테이블 수: {formatNumber(Math.round(summaryTableCount).toFixed(0))},
				평균 카드 매출: {formatNumber(Math.round(summaryCardSales).toFixed(0))},
				평균 현금 매출: {formatNumber(Math.round(summaryMoneySales).toFixed(0))},
				평균 서비스 매출: {formatNumber(Math.round(summaryServiceSales).toFixed(0))},
				평균 객 단가: {formatNumber(Math.round(summaryTotalPerSales).toFixed(0))},
				총 매출액: {formatNumber(Math.round(summaryTotalSales).toFixed(0))}
			</div>
		</>
	);
};

export default React.memo(Summary);
