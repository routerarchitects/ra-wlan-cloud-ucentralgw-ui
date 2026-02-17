import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import DhcpIpV4 from './DhcpIpV4';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
  isEnabled: boolean;
  role: string;
};

const IpV4 = ({ isDisabled, namePrefix, isEnabled, role }: Props) => {
  if (!isEnabled) return null;

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
        <StringField
          name={`${namePrefix}.subnet`}
          label="subnet"
          definitionKey="interface.ipv4.subnet"
          isDisabled={isDisabled}
          isRequired
        />
        <StringField
          name={`${namePrefix}.gateway`}
          label="gateway"
          definitionKey="interface.ipv4.gateway"
          isDisabled={isDisabled}
          isRequired
        />
        <ToggleField
          name={`${namePrefix}.send-hostname`}
          label="send-hostname"
          definitionKey="interface.ipv4.send-hostname"
          isDisabled={isDisabled}
          isRequired
        />
        {role === 'upstream' ? (
          <CreatableSelectField
            name={`${namePrefix}.use-dns`}
            label="use-dns"
            definitionKey="interface.ipv4.use-dns"
            isDisabled={isDisabled}
          />
        ) : null}
      </SimpleGrid>
      <DhcpIpV4 namePrefix={namePrefix} isDisabled={isDisabled} />
    </>
  );
};

export default React.memo(IpV4);
