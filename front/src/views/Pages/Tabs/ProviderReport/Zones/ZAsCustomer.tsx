import React from 'react';
import { CardContainer, PanelCustom, TableList } from '../../../../../components/Containers';

const ZAsCustomer = (props: any) => {
  const { id_asn, IPv4AsCustomers = {} } = props;
  const { name, tproviders = [], peers = [], clients = [] } = IPv4AsCustomers;

  const Pfx = (props: any) => {
    const { pfx } = props;
    return (
      <div className="pfx">
        <div className="pfx-1">AS</div>
        <div className="pfx-2">{pfx.substr(2)}</div>
      </div>
    );
  };

  return (
    <CardContainer className="form" title="IPv4 Provider Profile" id="profile">
      <PanelCustom title={name} value={<Pfx pfx={id_asn} />}>
        <TableList
          className="viewer"
          title="Transit Providers"
          value={tproviders.length}
          list={tproviders}
          maxItems={10}
        />
      </PanelCustom>
    </CardContainer>
  );
};

export default ZAsCustomer;
