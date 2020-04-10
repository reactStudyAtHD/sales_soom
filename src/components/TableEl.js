import React from 'react';

// const TableEl = (key, id, date, table, card, cash, service, total, per) => {
// 	return (
// 		<tr>
// 			<td>{date}</td>
// 			<td>{table}</td>
// 			<td>{card}</td>
// 			<td>{cash}</td>
// 			<td>{service}</td>
// 			<td>{per}</td>
// 		</tr>
//
// 	);
// };

const TableEl = (data) => {
	console.log(data)
	return (
		<tr>
			<td>{data.SALE_DATE}</td>

		</tr>
	
	);
};


export default TableEl;
