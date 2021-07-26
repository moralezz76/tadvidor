/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { drawChart } from './ScatterPlotHelper';
import './ScatterPlotComponent.scss';
import '../CommonStyles.scss';

interface IScatterPlotProps {
  data: string;
  id: string;
}

const ScatterPlot = (props: IScatterPlotProps) => {
  const { id, data } = props;

  useEffect(() => {
    data.length && drawChart({ id, info: data });
  }, [data]);

  return (
    <div className="stacked-plot svg-container">
      <div id={id} className="svg-content"></div>
    </div>
  );
};

export default ScatterPlot;
