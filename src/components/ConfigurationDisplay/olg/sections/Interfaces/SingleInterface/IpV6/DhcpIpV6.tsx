import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { INTERFACE_IPV6_DHCP_SCHEMA } from '../../interfacesConstants';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';

const DhcpIpV6: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFieldValue(`configuration[${index}].ipv6.dhcpv6`, INTERFACE_IPV6_DHCP_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`configuration[${index}].ipv6.dhcpv6`, undefined);
    }
  };

  const isEnabled = !!getIn(values, `configuration[${index}].ipv6.dhcpv6`);

  return (
    <>
      <Heading size="md" display="flex">
        <Text pt={1}>DHCPv6</Text>
        <Switch
          pt={1}
          onChange={onEnabledChange}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          mx={2}
          isDisabled={!editing}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={2} mt={2} w="100%">
          <SelectField
            name={`configuration[${index}].ipv6.dhcpv6.mode`}
            label="mode"
            definitionKey="interface.ipv6.dhcpv6.mode"
            options={[
              { value: 'hybrid', label: 'hybrid' },
              { value: 'stateless', label: 'stateless' },
              { value: 'stateful', label: 'stateful' },
              { value: 'relay', label: 'relay' },
            ]}
            isDisabled={!editing}
            emptyIsUndefined
          />
          <CreatableSelectField
            name={`configuration[${index}].ipv6.dhcpv6.announce-dns`}
            label="announce-dns"
            definitionKey="interface.ipv6.dhcpv6.announce-dns"
            emptyIsUndefined
          />
          <StringField
            name={`configuration[${index}].ipv6.dhcpv6.filter-prefix`}
            label="filter-prefix"
            definitionKey="interface.ipv6.dhcpv6.filter-prefix"
            isDisabled={!editing}
            emptyIsUndefined
          />
        </SimpleGrid>
      )}
    </>
  );
};

export default React.memo(DhcpIpV6);
