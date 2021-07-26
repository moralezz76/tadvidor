import React from 'react';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import './TopRuleComponent.scss';
import '../CommonStyles.scss';
import { IGenericObject } from '../../../config/interfaces';

interface ITopRuleProps {
  className?: string;
  start: Moment;
  end: Moment;
  currentTime: number;
}

const TopRule = (props: ITopRuleProps) => {
  const { start, end, className, currentTime } = props;

  const HourRule = (props: IGenericObject) => {
    const { param, parts = 4, currentTime } = props;
    const tt = moment.utc(param, 'X').format('HH:mm:ss');
    return (
      <div className="hour-rule">
        {[...Array(parts)].map((_, i: number) => {
          const selected = param + i * 60 < currentTime;
          return (
            <div className={classNames({ selected })} key={`hr_${i}`}>
              {i === 0 && <div className="title">{tt}</div>}
            </div>
          );
        })}
      </div>
    );
  };
  const step = (end.unix() - start.unix()) / 6;
  const dateRef = start.unix();
  const difMinutes = moment.utc(start.unix() + step, 'X').diff(start, 'minutes');
  return (
    <div className={classNames('top-rule', className)}>
      <div className="rule-padding" />
      {[...Array(6)].map((_, i: number) => {
        return (
          <HourRule
            param={dateRef + i * step}
            parts={difMinutes}
            currentTime={currentTime}
            key={`hrcpnt_${i}`}
          />
        );
      })}
      <div className="rule-padding">
        <div className="title">{moment.utc(end).format('HH:mm:ss')}</div>
      </div>
    </div>
  );
};

export default TopRule;
