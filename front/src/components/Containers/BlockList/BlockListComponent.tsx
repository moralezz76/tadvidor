import React from 'react';
import './BlockListComponent.scss';
import { t } from '../../../config/i18n';

import { TableList } from '..';
import { Asn, ButtonActions, Icon, PercentLine, UpDownArrow } from '../../Common';

const BlockListComponent = (props: any) => {
  const { data = {}, actions = [], ...rest } = props;

  const asnOptions = (arr: any, it: string) => {
    const r = arr[it];
    return r.map((i: string[], n: number) => {
      return [i[0], i[1], [i[3], i[4]], i[2], i[5], [actions, it, n]];
    });
  };

  const actionRender: any = [
    null,
    (v: any) => {
      return <Icon type={v} />;
    },
  ];

  const onRowClick = ([id]: any, n: any, it: string) => {
    const { onClick = () => {} } = actions[id];
    onClick(n, it);
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
    ([v, it, n]: any) => (
      <ButtonActions
        icon="dots"
        actions={v}
        actionRender={actionRender}
        onRowClick={(v: any) => onRowClick(v, it, n)}
        roundedIcon
      />
    ),
  ];

  return (
    <div className="block-list row">
      {Object.keys(data).map((blockTitle: any) => (
        <TableList
          key={blockTitle}
          title={t(`title${blockTitle}`)}
          className="table-block"
          list={asnOptions(data, blockTitle)}
          maxItems={10}
          render={render}
          {...rest}
        />
      ))}
    </div>
  );
};

export default BlockListComponent;
