import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { Rectangle } from 'recharts';
import React from 'react';
    
export const BarChartComponent = ({ data, currentIndex } ) => {
    const processedData = {
        ...data,
        currentDay: data.value >= 8 ? "#74E957" : "#FC8F2B",
        prevDay: data.valuePrev >= 8 ? "#74E957" : "#FC8F2B",
        nextDay: data.valueNext >= 8 ? "#74E957" : "#FC8F2B",
    };
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[data]} barCategoryGap="5%" barGap={80}  >  {/* Note that data is wrapped in an array here */}
                <Bar dataKey="valuePrev" background="#74E957" fill={processedData. prevDay}/>
                <Bar dataKey="value" background="#74E957" fill={processedData. currentDay} shape={<CustomBarShape stroke="#000" />}/>
                <Bar dataKey="valueNext" background="#74E957" fill={processedData.nextDay} />
            </BarChart>
        

        </ResponsiveContainer>
    );
}

const CustomBarShape = (props) => {
    const { fill, x, y, width, height, stroke } = props;
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={2} // Adjust the width of the border
      />
    );
  };