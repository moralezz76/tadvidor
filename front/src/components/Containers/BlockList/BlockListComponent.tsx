import React, { useState } from 'react';
import classNames from 'classnames';
import './BlockListComponent.scss';
import { CardContainer } from '../';
import { t } from '../../../config/i18n';

import { TableList } from '..';
import { Asn, Icon, PercentLine, UpDownArrow } from '../../Common';

const BlockListComponent = (props: any) => {
  const { blockHeaderProps = {}, data = {}, actions = () => [], dtbuttons = [], ...rest } = props;

  const handleItemClick = (v: any) => {};

  const asnOptions = (r: any) => {
    return r.map((i: string[], n: number) => {
      return [i[0], i[1], [i[3], i[4]], i[2], i[5]];
    });
  };

  const render: any = [
    (v: any) => <b>{v}.</b>,
    (v: any) => {
      const types = ['shieldL', 'shield'];
      return <Icon type={types[v]} />;
    },
    ([name, asn]: any) => (
      <>
        <div>{name}</div>
        <Asn pfx={asn} />
      </>
    ),
    (v: any) => <UpDownArrow value={v} />,
    (v: any) => <PercentLine percent={v} />,
  ];

  return (
    <div className="block-list row">
      {Object.keys(data).map((blockTitle: any) => (
        <TableList
          title={t(`title${blockTitle}`)}
          className="table-block"
          list={asnOptions(data[blockTitle])}
          maxItems={10}
          render={render}
          {...rest}
        />
      ))}
    </div>
  );
};

export default BlockListComponent;
