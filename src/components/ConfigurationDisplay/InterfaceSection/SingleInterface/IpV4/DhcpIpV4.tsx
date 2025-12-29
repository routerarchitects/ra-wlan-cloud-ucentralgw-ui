import React, { useMemo } from 'react';
import { Box, Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_IPV4_DHCP_LEASE_SCHEMA, INTERFACE_IPV4_DHCP_SCHEMA } from '../../interfacesConstants';
import StaticLeaseOffsetField from './StaticLeaseOffsetField';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/Form/Fields/ObjectArrayFieldModal';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
};

const DhcpIpV4 = ({ namePrefix, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: `${namePrefix}.dhcp` });
  const { value: ipv4 } = useFastField<{ subnet?: string } | undefined>({ name: `${namePrefix}` });
  const { onChange: onLeaseChange } = useFastField({ name: `${namePrefix}.dhcp-lease` });

  const isEnabled = value !== undefined;

  const defaultValue = INTERFACE_IPV4_DHCP_SCHEMA(t, true).cast();

  const onToggle = () => {
    if (isEnabled) {
      onChange(undefined);
      onLeaseChange(undefined);
    } else {
      onChange(defaultValue);
    }
  };

  const leasesField = useMemo(
    () => (
      <SimpleGrid minChildWidth="260px" spacing={4}>
        <StringField
          name="macaddr"
          label="MAC Address"
          definitionKey="interface.ipv4.dhcp-lease.macaddr"
          isRequired
          w="220px"
          formatValue={(v) => {
            const r = /([a-f0-9]{2})([a-f0-9]{2})/i;
            let str = v.replace(/[^a-f0-9]/gi, '');

            while (r.test(str)) {
              str = str.replace(r, `$1:$2`);
            }

            str = str.slice(0, 17);

            return str;
          }}
          mr={4}
        />
        <StaticLeaseOffsetField subnet={ipv4?.subnet} />
        <Box mr={4} w="180px">
          <StringField
            name="lease-time"
            label="lease-time"
            definitionKey="interface.ipv4.dhcp-lease.lease-time"
            isRequired
          />
        </Box>
        <ToggleField
          name="publish-hostname"
          label="publish-hostname"
          definitionKey="interface.ipv4.dhcp-lease.publish-hostname"
        />
      </SimpleGrid>
    ),
    [ipv4],
  );
  const leasesCols = useMemo(
    () => [
      {
        id: 'macaddr',
        Header: 'macaddr',
        Footer: '',
        accessor: 'macaddr',
        customWidth: '100px',
      },
      {
        id: 'static-lease-offset',
        Header: 'static-lease-offset',
        Footer: '',
        accessor: 'static-lease-offset',
        customWidth: '100px',
      },
      {
        id: 'lease-time',
        Header: 'lease-time',
        Footer: '',
        accessor: 'lease-time',
        customWidth: '100px',
      },
      {
        id: 'publish-hostname',
        Header: 'publish-hostname',
        Footer: '',
        accessor: 'publish-hostname',
        customWidth: '100px',
      },
    ],
    [],
  );
  return (
    <Box mt={4}>
      <Heading size="md" display="flex" flexWrap={{base: 'wrap', md: 'nowrap'}} gap={{base: 2, md: 0}}>
        <Text pt={1}>DHCPv4</Text>
        <Switch
          pt={1}
          onChange={onToggle}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          mx={2}
          isDisabled={isDisabled}
        />
        {isEnabled ? (
          <Box>
            <ObjectArrayFieldModal
              name={`${namePrefix}.dhcp-leases`}
              label="Reserved Addresses"
              fields={leasesField}
              columns={leasesCols}
              schema={INTERFACE_IPV4_DHCP_LEASE_SCHEMA}
              isDisabled={isDisabled}
              hideLabel
              emptyIsUndefined
              isRequired
              options={{
                modalTitle: 'Reserved Addresses',
                buttonLabel: 'Manage Reserved Addresses',
                onFormSubmit: (v: {
                  __temp_ip?: string;
                  secondMacAddress: string;
                  'lease-time': string;
                  'publish-hostname': boolean;
                }) => {
                  const newObj = v;
                  // Delete temp ip from the object
                  delete newObj.__temp_ip;

                  return newObj;
                },
              }}
            />
          </Box>
        ) : null}
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
          <NumberField
            name={`${namePrefix}.dhcp.lease-first`}
            label="lease-first"
            definitionKey="interface.ipv4.dhcp.lease-first"
            isDisabled={isDisabled}
            isRequired
          />
          <NumberField
            name={`${namePrefix}.dhcp.lease-count`}
            label="lease-count"
            definitionKey="interface.ipv4.dhcp.lease-count"
            isDisabled={isDisabled}
            isRequired
          />
          <StringField
            name={`${namePrefix}.dhcp.lease-time`}
            label="lease-time"
            definitionKey="interface.ipv4.dhcp.lease-time"
            isDisabled={isDisabled}
            isRequired
          />
          <StringField
            name={`${namePrefix}.dhcp.relay-server`}
            label="relay-server"
            definitionKey="interface.ipv4.dhcp.relay-server"
            isDisabled={isDisabled}
            emptyIsUndefined
          />
          <StringField
            name={`${namePrefix}.circuit-id-format`}
            label="circuit-id-format"
            definitionKey="interface.ipv4.dhcp.circuit-id-format"
            isDisabled={isDisabled}
            isRequired
          />
          <StringField
            name={`${namePrefix}.dhcp.remote-id-format`}
            label="remote-id-format"
            definitionKey="interface.ipv4.dhcp.remote-id-format"
            isDisabled={isDisabled}
            isRequired
          />
        </SimpleGrid>
      )}
    </Box>
  );
};

export default React.memo(DhcpIpV4);
