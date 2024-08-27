import React from 'react';
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, Rectangle, Cell } from "recharts";

// Utility function to determine the bar color based on the value
const getBarColor = (value) => {
    if (value === 0) return "#FF6347"; // Red for zero hours
    return value >= 8 ? "#74E957" : "#FC8F2B"; // Green for >= 8, Orange otherwise
};

export const BarChartComponent = ({ data }) => {
    const processedData = [
        { name: 'Prev Day', value: data.valuePrev, fill: getBarColor(data.valuePrev) },
        { name: 'Current Day', value: data.value, fill: getBarColor(data.value) },
        { name: 'Next Day', value: data.valueNext, fill: getBarColor(data.valueNext) }
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
    <BarChart data={processedData} barCategoryGap="5%" barGap={0}>
        <YAxis axisLine={false} tickLine={false}  domain={[0, 10]} />
        <Bar dataKey="value" shape={<CustomBarShape />}>
            {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Bar>
    
    </BarChart>
</ResponsiveContainer>
    );
};

const CustomBarShape = (props) => {
    const { fill, x, y, width, height, stroke = '#000' } = props;
    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
            radius={[10, 10, 0, 0]} // Rounded corners on top
        />
    );
};