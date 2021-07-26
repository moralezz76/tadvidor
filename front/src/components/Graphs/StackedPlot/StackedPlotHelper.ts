import * as d3 from 'd3';
import { IGenericObject } from '../../../config/interfaces';
import moment from 'moment';

interface IGraphBallAndStickProps {
  id: string;
  info: IGenericObject;
  colors: IGenericObject;
  maxData: number;
  currTime?: (time: number) => void;
}
export const drawChart = (props: IGraphBallAndStickProps) => {
  const { id, info, colors, maxData, currTime } = props;

  const strokeWidth = 1;
  const margin = { top: 5, bottom: 20, left: 30, right: 20 };
  const width = 600 - margin.left - margin.right - strokeWidth * 2;
  const height = 200 - margin.top - margin.bottom;

  d3.select('#' + id + ' svg').remove(); // remove old svg

  ////console.log(info);

  const { items, data }: IGenericObject = getDataFromJson(info);
  if (!items) return;

  const keys = Object.keys(data[0]);
  const mainKey = 'time';

  const mainIndex = keys.indexOf(mainKey);
  if (mainIndex > -1) {
    keys.splice(mainIndex, 1);
  }

  const arrayColors = items.map((i: string) => colors[i]);

  // Create SVG and padding for the chart
  const svg = d3
    .select(`#stacked_plot_testgraph`)
    .append('svg')
    .attr('height', 200)
    .attr('width', 600);

  // GRADIENT logic

  arrayColors.forEach((c: string, i: number) => {
    var areaGradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', `areaGradient${i}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '40%')
      .attr('stop-color', c)
      .attr('stop-opacity', 0.6);
    areaGradient
      .append('stop')
      .attr('offset', '80%')
      .attr('stop-color', c)
      .attr('stop-opacity', 0.4);
  });

  const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const grp = chart
    .append('g')
    .attr('transform', `translate(-${margin.left - strokeWidth},${margin.top})`);

  // Create stack
  const stack = d3.stack().keys(keys);
  const stackedValues = stack(data);
  const stackedData: any = [];
  // Copy the stack offsets back into the data.
  stackedValues.forEach((layer, index) => {
    const currentStack: any = [];
    layer.forEach((d, i) => {
      currentStack.push({
        values: d,
        time: data[i].time,
      });
    });
    stackedData.push(currentStack);
  });

  const some: any = d3.extent(data, (dataPoint: any) => dataPoint.time);
  // Create scales
  const yScale = d3.scaleLinear().range([height, 0]).domain([0, maxData]);
  const xScale = d3.scaleLinear().range([0, width]).domain(some);

  const area = d3
    .area<any>()
    .x(dataPoint => xScale(dataPoint.time))
    .y0(dataPoint => yScale(dataPoint.values[0]))
    .y1(dataPoint => yScale(dataPoint.values[1]));

  const series = grp
    .selectAll('.series')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('class', 'series');

  series
    .append('path')
    .attr('id', (d: any, i: number) => `path${i}`)
    .attr('transform', `translate(${margin.left},-${margin.top})`)
    .style('fill', (d: any, i: number) => `url(#areaGradient${i})`)
    .attr('stroke', 'white')
    .attr('class', 'pathline')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', strokeWidth)
    .attr('d', (d: any) => area(d));

  // Add the X Axis
  chart
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(7)
        .tickFormat((d: any) => moment.utc(d, 'X').format('HH:mm'))
    );

  // Add the Y Axis
  chart.append('g').attr('transform', `translate(0, 0)`).call(d3.axisLeft(yScale));

  // MOUSEOVER EFFECTS

  const over = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const rect_over = over
    .append('rect') // append a rect to catch mouse movements on canvas
    .attr('width', width - 7) // can't catch mouse events on a g element
    .attr('height', height)
    //.attr('fill', 'none')
    .style('opacity', 0);

  over
    .append('path') // this is the black vertical line to follow mouse
    .attr('class', 'mouse-line')
    .style('stroke', 'red')
    .style('stroke-width', '1px')
    .style('opacity', 0.5);

  var lines: any = document.getElementsByClassName('pathline');

  over // circles in lines
    .selectAll('.circle')
    .data(stackedData)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('class', 'circle')
    .style('fill', 'red')
    .style('stroke-width', '1px')
    .style('opacity', 0);

  series
    .append('text')
    .text(
      (d: any, i: any) => items[i]
      //return d.item;
    )
    .attr('class', 'tooltip')
    .style('opacity', 0);

  var circles: any = document.getElementsByClassName('circle');
  var tooltips: any = document.getElementsByClassName('tooltip');

  rect_over.on('mousemove mousedown mouseup', function (event, d: any) {
    const { target, pageX, which, type } = event;
    const { left } = target.getBoundingClientRect();
    const posX = pageX - left;

    //const me = d3.select(this);
    svg.classed('moving', which !== 0 && type !== 'mouseup'); // set moving class to mouse pointer effect
    if (which === 0) return;

    var mouse = d3.pointer(event);

    d3.select('.mouse-line').attr(
      // move red line to coordinates
      'd',
      () => `M${mouse[0]},${height} ${mouse[0]},0`
    );

    svg.selectAll('.series path').each((d: any, i: number) => {
      // calculate circle coordinates
      let pos: IGenericObject = {};
      var beginning = 0,
        end = lines[i].getTotalLength(),
        target = null;

      while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = lines[i].getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
          break;
        }
        if (pos.x > mouse[0]) end = target;
        else if (pos.x < mouse[0]) beginning = target;
        else break; //position found
      }

      //////console.log(yScale.invert(pos.y));
      //////console.log(xScale.invert(posX));

      currTime && currTime(xScale.invert(posX));

      d3.select(circles[i]) // move circles to position
        .style('opacity', 0.5)
        .attr('cx', posX)
        .attr('cy', pos.y);

      d3.select(tooltips[i]) // move circles to position
        .text(yScale.invert(pos.y).toFixed(0))
        .attr('transform', `translate(${posX + margin.left + 3}, ${pos.y - 1})`)
        .style('opacity', 1);
    });
  });
}; //////////////////////////////////////////////////// <<<<---------------- END

interface IDataFromJson {
  items?: string[];
  data?: IGenericObject;
  times?: string[];
}

const getDataFromJson = (json: any): IDataFromJson => {
  const k_of = Object.keys(json);
  if (k_of.length === 0) return {};

  const times = Object.keys(json[k_of[0]]);
  const data = Object.keys(times).reduce((ret: any, time: any) => {
    const tdata = times[time];
    //////console.log(tdata);
    return [
      ...ret,
      Object.keys(k_of).reduce(
        (ret1: any, k: any) => {
          return {
            ...ret1,
            [k_of[k]]: json[k_of[k]][tdata],
          };
        },
        { time: parseFloat(tdata) }
      ),
    ];
  }, []);
  const ret: IDataFromJson = {
    items: k_of,
    data,
    times,
  };
  return ret;
};
