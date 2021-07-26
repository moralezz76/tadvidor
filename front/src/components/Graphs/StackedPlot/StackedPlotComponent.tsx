/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { drawChart } from './StackedPlotHelper';
import './StackedPlotComponent.scss';
import '../CommonStyles.scss';
import { IGenericReactNode } from '../../../config/interfaces';

interface IStackedPlotProps {
  data: {};
  id: string;
  colors: IGenericReactNode;
  maxData: number;
  changeTime?: (time: number) => void;
}

const StackedPlot = (props: IStackedPlotProps) => {
  const { id, data, colors, maxData, changeTime } = props;

  const currTime = (time: number) => {
    changeTime && changeTime(time);
  };

  useEffect(() => {
    drawChart({ id, info: data, colors, maxData, currTime });
  }, [data]);

  return (
    <div className="stacked-plot svg-container">
      <div id={id} className="svg-content"></div>
    </div>
  );
};

export default StackedPlot;
