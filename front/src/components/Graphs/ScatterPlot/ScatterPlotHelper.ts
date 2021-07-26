import * as d3 from 'd3';
import moment from 'moment';
import { IGenericObject } from '../../../config/interfaces';

interface IGraphBallAndStickProps {
  id: string;
  info: string;
}
export const drawChart = (props: IGraphBallAndStickProps) => {
  const { id, info } = props;

  const strokeWidth = 1;
  const dotRadius = 1;
  const margin = { top: 30, bottom: 30, left: 50, right: 20 };
  const width = 540 - margin.left - margin.right - strokeWidth * 2;
  const height = 250 - margin.top - margin.bottom;

  d3.select('#' + id + ' svg').remove(); // remove old svg

  const { data, allGroup, maxData }: IGenericObject = getDataFromInfo(info);

  // Create SVG and padding for the chart
  const svg = d3
    .select('#' + id)
    .append('svg')
    .attr('height', 300)
    .attr('width', 600);

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

  // console.log(data);
  const some: any = d3.extent(data[0].values, (dataPoint: any) => {
    //console.log(dataPoint);
    return dataPoint.time;
  });
  // Add X axis --> it is a date format

  var x = d3.scaleLinear().range([0, width]).domain(some);
  const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  chart
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3
        .axisBottom(x)
        .ticks(7)
        .tickFormat((d: any) => moment.utc(d, 'X').format('HH:mm'))
    );

  // Add Y axis

  console.log(data);
  console.log(maxData);

  var y = d3.scaleLinear().range([height, 0]).domain([0, maxData]);
  chart.append('g').call(d3.axisLeft(y));

  // Add the lines
  var line = d3
    .line()
    .x((d: any) => x(+d.time))
    .y((d: any) => y(+d.value));
  chart
    .selectAll('myLines')
    .data(data)
    .enter()
    .append('path')
    .attr('d', (d: any) => line(d.values))
    .attr('stroke', (d: any): any => myColor(d.name))
    .style('stroke-width', strokeWidth)
    .style('fill', 'none');

  /*
  // Add the points
  chart
    // First we need to enter in a group
    .selectAll('myDots')
    .data(data)
    .enter()
    .append('g')
    .style('fill', (d: any): any => myColor(d.name))
    // Second we need to enter in the 'values' part of this group
    .selectAll('myPoints')
    .data((d: any) => d.values)
    .enter()
    .append('circle')
    .attr('cx', (d: any) => x(d.time))
    .attr('cy', (d: any) => y(d.value))
    .attr('r', dotRadius);
  //.attr('stroke', 'white');*/

  // Add a legend at the end of each line

  /*chart
    .selectAll('myLabels')
    .data(data)
    .enter()
    .append('g')
    .append('text')
    .datum((d: any) => ({ name: d.name, value: d.values[d.values.length - 1] })) // keep only the last value of each time series
    .attr('transform', (d: any) => 'translate(' + x(d.value.time) + ',' + y(d.value.value) + ')') // Put the text at the position of the last point
    .attr('x', 12) // shift the text a bit more right
    .text((d: any) => d.name)
    .style('fill', (d: any): any => myColor(d.name))
    .style('font-size', 15);
  //});*/
}; //////////////////////////////////////////////////// <<<<---------------- END

interface IDataFromJson {
  data: IGenericObject;
  allGroup: string[];
  maxData: number;
}

const getDataFromInfo = (info: string): IDataFromJson => {
  let maxData: number = -1;
  var allGroup = ['Min', 'value', 'Max'];
  const pt = info.split('\n');
  const data = allGroup.map((grpName: string, i: number) => {
    return {
      name: grpName,
      values: pt.map((d: any) => {
        console.log(maxData);
        const [time, ...rest] = d.split(' ');
        maxData = parseFloat(rest[i]) > maxData ? parseFloat(rest[i]) : maxData;
        return { time: parseFloat(time), value: +rest[i] };
      }),
    };
  });

  return {
    allGroup,
    data,
    maxData,
  };
};
