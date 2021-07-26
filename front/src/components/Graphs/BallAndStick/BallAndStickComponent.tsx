/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { drawChart } from './BallAndStickHelper';
import './BallAndStickComponent.scss';
import '../CommonStyles.scss';
import { IGenericObject } from '../../../config/interfaces';

interface IBallAndStickProps {
  data: {};
  id: string;
  ip: string;
  nodeItemClick?: (name: string) => void;
  handleNodes?: (nodes: IGenericObject) => void;
}

const BallAndStick = (props: IBallAndStickProps) => {
  const { id, data, nodeItemClick, handleNodes, ip } = props;

  useEffect(() => {
    //////console.log(data);
    drawChart({ id, info: data, nodeItemClick, handleNodes, ip });
  }, [data]);

  return (
    <div className="ball-and-stick svg-container">
      <div id={id} className="svg-content"></div>
    </div>
  );
};

export default BallAndStick;
