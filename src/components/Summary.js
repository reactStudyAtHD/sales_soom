import React from 'react';

const Summary = ({ summary }) => {
	const { summaryTableCount, summaryCardSales, summaryMoneySales, summaryServiceSales, summaryTotalPerSales, summaryTotalSales } = summary;
	return (
		<>
			<div style={{ textAlign: 'center', marginTop: '2vw' }}>
				평균 테이블 수: {summaryTableCount},
				평균 카드 매출: {summaryCardSales},
				평균 현금 매출: {summaryMoneySales},
				평균 서비스 매출: {summaryServiceSales},
				평균 객 단가: {summaryTotalPerSales},
				총 매출액: {summaryTotalSales}
			</div>
		</>
	);
};

export default Summary;
