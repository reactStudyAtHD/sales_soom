import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const MonthlySales = () => {
	const date = new Date();
	const onChange = () => {
	
	}
	return (
		<div>
			<Calendar
				onChange={onChange}
				value={date}
				locale="ko"
			/>
		</div>
	);
};

export default React.memo(MonthlySales);
