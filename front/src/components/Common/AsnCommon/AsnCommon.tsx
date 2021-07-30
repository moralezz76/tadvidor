import React from 'react';

import './AsnCommon.scss';

const AsnCommon = (props: any) => {
  const { pfx } = props;

  const pfxNum = pfx.substr(0, 2).toLowerCase() === 'as' ? pfx.substr(2) : pfx;
  return (
    <div className="asn-common">
      <div className="pfx">
        <div className="pfx-1">AS</div>
        <div className="pfx-2">{pfxNum}</div>
      </div>
    </div>
  );
};

export default AsnCommon;
