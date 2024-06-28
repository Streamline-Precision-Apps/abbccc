import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer} from "recharts";
import React from 'react';
    
export const BarChartComponent = ({ data, currentIndex } ) => {
    const processedData = {
        ...data,
        currentDay: data.value >= 8 ? "#74E957" : "#FC8F2B",
        prevDay: data.valuePrev >= 8 ? "#74E957" : "#FC8F2B",
        nextDay: data.valueNext >= 8 ? "#74E957" : "#FC8F2B",
    };
    
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={[data]}  >  {/* Note that data is wrapped in an array here */}
                <XAxis dataKey="day"/>
                <YAxis domain={[0,8]} />
                <Bar dataKey="valuePrev" background="#74E957" fill={processedData. prevDay}/>
                <Bar dataKey="value" background="#74E957" fill={processedData. currentDay}/>
                <Bar dataKey="valueNext" background="#74E957" fill={processedData.nextDay} />
            </BarChart>
        

        </ResponsiveContainer>
    );
}