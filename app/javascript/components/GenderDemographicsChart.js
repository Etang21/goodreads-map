// Takes in a dictionary from genders to counts, displays as chart
import React from 'react'
import {PieChart, Pie, Cell} from 'recharts'

const GenderDemographicsChart = ({genders}) => {
  //Takes in genders, a Map, formats properly for recharts as list of objects
  const data = rechartsDataFromMap(genders)
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <PieChart width={730} height={250}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        startAngle={0}
        endAngle={180}
        paddingAngle={5}
        fill="#8884d8"
        label={label => label.name + ' (' + label.value + ')' }
        isAnimationActive={false}
      > //Disable animation due to invisible label bug in recharts
        {
          data.map((entry, index) =>
            <Cell fill={COLORS[index % COLORS.length]} key={index}/>
          )
        }
      </Pie>
    </PieChart>
  )
}

const rechartsDataFromMap = (dataMap) => {
  // Format dictionary of keys:counts into a list of objects for recharts
  // I swear my Javascript style will improve
  if (dataMap == null) {
    return []
  }
  const keysArr = Array.from(dataMap.keys())
  var data = []
  var i = 0
  for (i = 0; i < keysArr.length; i++) {
    var key = keysArr[i]
    data.push({"name": key, "value": dataMap.get(key)})
  }
  return data
}

export default GenderDemographicsChart
