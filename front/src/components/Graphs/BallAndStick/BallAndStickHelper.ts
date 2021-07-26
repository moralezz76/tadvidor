import * as d3 from 'd3';
import { IGenericObject } from '../../../config/interfaces';

interface IGraphBallAndStickProps {
  id: string;
  info: IGenericObject;
  ip: string;
  width?: number;
  height?: number;
  nodeItemClick?: (name: string) => void;
  handleNodes?: (nodes: IGenericObject) => void;
}
export const drawChart = (props: IGraphBallAndStickProps) => {
  const { nodeItemClick, id, info, width = 500, height = 250, handleNodes, ip } = props;

  const data: IGenericObject = getDataFromJson(info);

  d3.select('#' + id + ' svg').remove(); // remove old svg

  const { connections, depthInfo, nodes } = data;

  const nodeArray = Object.keys(nodes).reduce((ret: any, item: any) => {
    // if have ".posX", can by place...
    return [...ret, ...(nodes[item].posX || item === '0' ? [{ ...nodes[item], item }] : [])];
  }, []);

  const itemsWithData = nodeArray.reduce((ret: any, item: any) => {
    return [...ret, item.item];
  }, []);

  const range = d3.scaleOrdinal().domain(itemsWithData).range(d3.schemeSet2);
  const colors = itemsWithData.reduce(
    (ret: any, i: any) => {
      return {
        ...ret,
        [i]: range(i),
      };
    },
    { other: '#cccccc' }
  );
  /*let maxData = 0;
  if (info[0]) {
    const firstKeyData = info[0][Object.keys(info[0]).pop() as any]; // obtain dates (Object.keys(firstKeyData))
    maxData = Object.keys(firstKeyData).reduce((ret: any, I: any) => {
      return firstKeyData[I] > ret ? firstKeyData[I] : ret;
    }, 0);
  }*/

  let maxData = 0;
  const info0 = info[0];
  if (info0) {
    const keyOf0 = Object.keys(info0);
    const anyKey: any = keyOf0.pop(); // last key
    const keyData = info0[anyKey]; // obtain dates (Object.keys(keyData))
    let _max = 0;
    Object.keys(keyData).forEach((k: any) => {
      _max = Object.keys(info0).reduce((ret: any, I: any) => {
        return ret + parseInt(info0[I][k]);
      }, 0);
      if (_max > maxData) maxData = _max;
    });
  }

  /*

  let maxData = 0;
  Object.keys(info).forEach((x: any) => {
    const _nfo = info[x] || {};

    let _max = 0;
    Object.keys(_nfo).forEach((k: any) => {
      const _data = _nfo[k];
      _max += Object.keys(_data).reduce((ret: any, I: any) => {
        return _data[I] > ret ? _data[I] : ret;
      }, 0);
    });
    if (_max > maxData) maxData = _max;
  });
  */

  handleNodes && handleNodes({ colors, maxData });
  const clickItem = (item: string) => {
    d3.selectAll(`.link`).classed('flowline', false);
    d3.selectAll(`.parent_${item}`).classed('flowline', true);
    d3.selectAll('text, rect').classed('selected', false);
    d3.selectAll(`.node-${item}`).classed('selected', true);
    nodeItemClick && nodeItemClick(item);
  };

  const svg = d3
    .select('#' + id)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 9)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('markerUnits', 'strokeWidth')

    .append('path')
    .style('stroke', '#666666')
    .style('stroke-width', 3)
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('class', 'arrowHead');

  const svgNodes = svg.selectAll('.text').data(nodeArray);

  svgNodes // Texts
    .enter()
    .append('text')
    .text(function ({ item }, i) {
      return item === '0' ? ip : item;
    })
    .call(s => getBB(s, connections, depthInfo, width, height))
    .attr('transform', function (d) {
      const {
        coordinates: { x, y },
      } = d;
      return `translate(${x},${y})`;
    })
    .attr('class', ({ item }: any) => `node-${item} text`)
    .each(function (d) {
      //////console.log(d);
    })
    .on('click', function (a, d) {
      const { item } = d;
      clickItem(item);
    });

  const textPadding = 4;

  svgNodes // rects
    .enter()
    .insert('rect', 'text')
    .attr('class', ({ item }: any) => `node-${item}`)
    .attr('transform', function (d) {
      const {
        coordinates: { x, y },
        bbox: { height: H },
      } = d;
      return `translate(${x - textPadding - 4},${y - H / 2 - textPadding})`;
    })
    .attr('width', ({ bbox: { width } }) => width + textPadding * 2 + 8)
    .attr('height', ({ bbox: { height: H } }) => H + textPadding * 2 - 8)
    .style('fill', '#dddddd')
    .attr('rx', 4)
    .attr('ry', 4)
    .style('stroke', '#999999')
    .style('fill', ({ item }) => {
      return colors[item];
    })

    .each(function (dRect) {
      // path link

      const { itemNodes, item } = dRect;
      const ddata = svgNodes.enter().data();
      const linksData = itemNodes.map((node: string) => ddata.find(i => i.item === node));

      svgNodes
        .data(linksData)
        .enter()
        .append('path')
        .attr('class', `link parent_${item}`)
        .attr('height', 12)

        .each(function (dNode: any) {
          const me = d3.select(this);
          const pathType = dSourceTargetPathType(dRect, dNode, textPadding);

          me.attr('marker-end', 'url(#arrow)')

            .style('stroke-width', 1)
            .attr('d', pathType);
        });
    })
    .on('click', function (a, d) {
      const { item } = d;
      clickItem(item);
    });
};

var linkDiagonal: any = d3
  .linkHorizontal()
  .x(({ x }: any) => x)
  .y(({ y }: any) => y);

var linkCurve: any = d3
  .line()
  .curve(d3.curveBasis)
  .x(([x, y]: any) => x)
  .y(([x, y]: any) => y);

const dSourceTargetPathType = (dSource: any, dTarget: any, padding: number) => {
  const {
    posX: sPosX,
    posY: sPosY,
    coordinates: { x: sX, y: sY },
    bbox: { width: sW },
    xDistance,
  } = dSource;

  const {
    posX: tPosX,
    posY: tPosY,
    coordinates: { x: tX, y: tY },
    bbox: { width: tW },
  } = dTarget;

  const ysAdjust = (tY - sY) / 30;
  const ytAdjust = (sY - tY) / 30;

  const sourceOverTarget = sPosY < tPosY ? -1 : 1;

  const xCorrection = sW + padding * 2 + 1;

  const ysCorrection = (sW / 2 + 2) * sourceOverTarget + (sourceOverTarget === -1 ? 8 : 0);
  const ytCorrection = (sW / 2 - padding) * sourceOverTarget - (sourceOverTarget === -1 ? 8 : 0);

  const sxCorrection = sourceOverTarget === -1 ? sW - padding : 0;
  const txCorrection = sourceOverTarget === -1 ? tW - padding : 0;

  if (sPosX < tPosX)
    return linkDiagonal({
      source: {
        x: sX + xCorrection,
        y: sY - padding + ysAdjust,
      },
      target: { x: tX - padding * 2 - 1, y: tY - padding + ytAdjust },
    });
  else if (sPosX === tPosX)
    return linkCurve([
      [sX + sxCorrection, sY - ysCorrection],
      [sX + sxCorrection - (sourceOverTarget * xDistance) / 4, sY - (sY - tY) / 2],
      [tX + txCorrection, tY + ytCorrection],
    ]);
};

const getDataFromJson = (json: any): IGenericObject => {
  let connections: IGenericObject[] = []; // connection node to node
  let nodes: IGenericObject[string] = [];

  Object.keys(json).forEach((from: string) => {
    const count = json[from];
    if (!nodes[from]) nodes[from] = { childs: [] };
    Object.keys(count).forEach((to: string) => {
      if (to !== 'other') {
        const { childs = [] } = nodes[from];
        nodes[from] = { ...nodes[from], childs: [...childs, to] };

        if (!nodes[to]) nodes[to] = { parents: [from] };
        else {
          const { parents = [] } = nodes[to];
          nodes[to] = { ...nodes[to], parents: [...parents, from] };
        }
        connections.push({ from, to });
      }
    });
  });

  const depthInfo = nodes.length ? setNodeDepth([], nodes, ['0'], 0) : {};
  return {
    connections,
    nodes,
    depthInfo,
    //maxDepth: maxDepth(depthInfo),
  };
};

/********************************************/
// return bbox, coordinates {x,y} into svg  //
// and itemNodes []: nodes conections       //
/********************************************/

function getBB(
  selection: d3.Selection<SVGTextElement, any, SVGGElement, unknown>,
  connections: any,
  nodeArray: any,
  width: number,
  height: number
) {
  selection.each(function (d: any) {
    /////////////////////

    const bbox = this.getBBox();
    const { width: bWidth } = bbox;
    const { posX, posY, item } = d;

    const itemCount = nodeArray[posX].length;
    let columns = Math.round(width / nodeArray.length);
    //columns = columns > 80 ? 80 : columns;

    const parts = Math.round(height / (itemCount - 0));
    const half = parts / 2;
    d.xDistance = columns;

    d.coordinates = {
      x: posX * columns + columns / 2 - bWidth / 2,
      y: posY * parts + half,
    };

    if (item === '0') {
      ////console.log(columns);
      ////console.log(d);
    }

    /////////////////////

    const itemNodes = Object.keys(connections).reduce((ret: any, i: string) => {
      const { from, to } = connections[i];
      return [...ret, ...(from === item ? [to] : [])];
    }, []);

    d.itemNodes = itemNodes;
    d.bbox = bbox;
  });
}

/********************************************/
// return an array of items in each columns //
/********************************************/

const setNodeDepth: any = (ret: any, nodes: IGenericObject, items: string[], newDepth: number) => {
  let nextNodes: any = [];

  items.forEach(nodeName => {
    if (!existNodeInArray(ret, nodeName)) {
      if (!ret[newDepth]) ret[newDepth] = [];
      ret[newDepth].push(nodeName);
      const { childs = [] } = nodes[nodeName];
      nextNodes = [...nextNodes, ...childs];
      nodes[nodeName].posX = newDepth;
      nodes[nodeName].posY = ret[newDepth].length - 1;
    }
  });
  if (nextNodes.length) return setNodeDepth(ret, nodes, nextNodes, newDepth + 1);
  else return ret;
};

const existNodeInArray = (ret: any, item: any) => {
  let find = false;
  Object.keys(ret).forEach((retDepth: string) => {
    if (ret[retDepth].includes(item)) return (find = true);
  });
  return find;
};

/*
const maxDepth = (info: any) => {
  let max = 0;
  Object.keys(info).forEach((retDepth: string) => {
    const { length } = info[retDepth];
    max = length > max ? length : max;
  });
  return max;
};
*/
