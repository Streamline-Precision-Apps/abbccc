import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer} from "recharts";
import React from 'react';
    
export const BarChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width="80%" height="100%">
            <BarChart data={[data]} >  // Note that data is wrapped in an array here
                <XAxis fill="#74E957" display={false}/>
                <YAxis domain={[0, 24]}/>
                <Tooltip />
                <Legend fill="#74E957"/>
                <Bar dataKey="value" fill="#74E957" />
            </BarChart>
        </ResponsiveContainer>
    );
}