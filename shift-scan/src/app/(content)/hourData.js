import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer} from "recharts";
import React from 'react';
    
export const BarChartComponent = ({ data } ) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[data]} >  {/* Note that data is wrapped in an array here */}
                <XAxis display={"none"}/>
                <YAxis domain={[0,14]} display={"none"}/>
                <Legend fill="#74E957"/>
                <Bar dataKey="value" background="#233861" fill="#74E957"  />
                <Bar dataKey={"total"} background="" fill="#233861"  />
            </BarChart>
        </ResponsiveContainer>
    );
}