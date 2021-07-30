import React from 'react';
import { Asn, Icon } from '../../../../../components/Common';
import { CardContainer, PanelCustom, TableList } from '../../../../../components/Containers';

const ZProfile = (props: any) => {
  const { id_asn, profileData = {}, onRowClick = () => {} } = props;
  const { name, tproviders = [], peers = [], clients = [] } = profileData;

  const render: any = [
    (v: any) => <b>{v}</b>,
    (v: any) => <Icon type={v} className={v} />,
    ([asn, name]: any) => (
      <>
        <div>{name}</div>
        <Asn pfx={asn} />
      </>
    ),
  ];

  const asnOptions = (r: any) => {
    return r.reduce((ret: [], i: string[], n: number) => {
      return [...ret, [<b>{n + 1}.</b>, 'bookmarkL', [i[0], i[1]]]];
    }, []);
  };

  return (
    <CardContainer className="z-profile" title="IPv4 Provider Profile" id="profile">
      <PanelCustom title={name} value={<Asn pfx={id_asn} />}>
        <TableList
          className="viewer"
          title={
            <b>
              <Icon type="caret" size="20px" /> Transit Providers: {tproviders.length}
            </b>
          }
          list={asnOptions(tproviders)}
          maxItems={10}
          onRowClick={onRowClick}
          render={render}
        />
        <TableList
          className="viewer"
          title={
            <b>
              <Icon type="caret" size="20px" /> Peers: {peers.length}
            </b>
          }
          list={asnOptions(peers)}
          maxItems={10}
          onRowClick={onRowClick}
          render={render}
        />
        <TableList
          className="viewer"
          title={
            <b>
              <Icon type="caret" size="20px" /> Clients: {clients.length}
            </b>
          }
          list={asnOptions(clients)}
          maxItems={10}
          onRowClick={onRowClick}
          render={render}
        />
      </PanelCustom>
    </CardContainer>
  );
};

export default ZProfile;
