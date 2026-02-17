import React from 'react';
import { NumberField } from 'components/Form/Fields/NumberField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
  type: string;
};

const TunnelValues = ({ isDisabled, namePrefix, type }: Props) => {
  if (type === '' || type === 'mesh') return null;

  if (type === 'vxlan')
    return (
      <>
        <StringField
          key="vxlan.peer-address"
          name={`${namePrefix}.peer-address`}
          label="peer-address"
          definitionKey="interface.tunnel.vxlan.peer-address"
          isDisabled={isDisabled}
          isRequired
        />
        <NumberField
          key="vxlan.peer-port"
          name={`${namePrefix}.peer-port`}
          label="peer-port"
          definitionKey="interface.tunnel.vxlan.peer-port"
          isDisabled={isDisabled}
          isRequired
        />
      </>
    );

  if (type === 'l2tp') {
    return (
      <>
        <StringField
          key="l2tp.server"
          name={`${namePrefix}.server`}
          label="server"
          definitionKey="interface.tunnel.l2tp.server"
          isDisabled={isDisabled}
          isRequired
        />
        <StringField
          key="l2tp.user-name"
          name={`${namePrefix}.user-name`}
          label="user-name"
          definitionKey="interface.tunnel.l2tp.user-name"
          isDisabled={isDisabled}
          isRequired
        />
        <StringField
          key="l2tp.password"
          name={`${namePrefix}.password`}
          definitionKey="interface.tunnel.l2tp.password"
          label="password"
          isDisabled={isDisabled}
          isRequired
          hideButton
        />
      </>
    );
  }

  return (
    <>
      <StringField
        key="gre.peer-address"
        name={`${namePrefix}.peer-address`}
        label="peer-address"
        definitionKey="interface.tunnel.gre.peer-address"
        isDisabled={isDisabled}
        isRequired
      />
      <ToggleField
        key="gre.dhcp-healthcheck"
        name={`${namePrefix}.dhcp-healthcheck`}
        label="dhcp-healthcheck"
        definitionKey="interface.tunnel.gre.dhcp-healthcheck"
        isDisabled={isDisabled}
        isRequired
      />
    </>
  );
};

export default React.memo(TunnelValues);
