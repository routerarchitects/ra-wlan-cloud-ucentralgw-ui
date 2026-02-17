import * as React from 'react';
import { Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { SERVICES_DHCP_RELAY_VLAN_SCHEMA } from './servicesConstants';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';

type Props = {
  isEditing: boolean;
};

const selectPortsOptions = [
  {
    value: '*',
    label: 'All',
  },
  {
    value: 'WAN*',
    label: 'WAN*',
  },
  {
    value: 'LAN*',
    label: 'LAN*',
  },
  {
    value: 'LAN1',
    label: 'LAN1',
  },
  {
    value: 'LAN2',
    label: 'LAN2',
  },
  {
    value: 'LAN3',
    label: 'LAN3',
  },
  {
    value: 'LAN4',
    label: 'LAN4',
  },
  {
    value: 'LAN5',
    label: 'LAN5',
  },
  {
    value: 'LAN6',
    label: 'LAN6',
  },
  {
    value: 'LAN7',
    label: 'LAN7',
  },
  {
    value: 'LAN8',
    label: 'LAN8',
  },
  {
    value: 'LAN9',
    label: 'LAN9',
  },
  {
    value: 'LAN10',
    label: 'LAN10',
  },
  {
    value: 'LAN11',
    label: 'LAN11',
  },
  {
    value: 'LAN12',
    label: 'LAN12',
  },
];

const DhcpRelay = ({ isEditing }: Props) => {
  const columns = React.useMemo(
    () => [
      {
        id: 'vlan',
        Header: 'Vlan ID',
        Footer: '',
        accessor: 'vlan',
        customWidth: '40px',
      },
      {
        id: 'circuit-id-format',
        Header: 'Circuit ID Format',
        Footer: '',
        accessor: 'circuit-id-format',
      },
      {
        id: 'remote-id-format',
        Header: 'Remote ID Format',
        Footer: '',
        accessor: 'remote-id-format',
      },
      {
        id: 'relay-server',
        Header: 'Relay Server',
        Footer: '',
        accessor: 'relay-server',
      },
    ],
    [],
  );

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          DHCP Relay
        </Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={2} mt={2} w="100%">
          <MultiSelectField
            name="configuration.dhcp-relay.select-ports"
            label="select-ports"
            options={selectPortsOptions}
            isRequired
            isDisabled={!isEditing}
          />
          <ObjectArrayFieldModal
            name="configuration.dhcp-relay.vlans"
            label="vlans"
            fields={
              <Box>
                <Flex>
                  <Box w="100px" mr={2}>
                    <NumberField name="vlan" label="VLAN ID" isRequired w="100px" />
                  </Box>
                  <StringField name="relay-server" label="Relay Server" isRequired maxW="300px" />
                </Flex>
                <Flex mt={4}>
                  <Box mr={2}>
                    <SelectField
                      name="circuit-id-format"
                      label="Circuit ID Format"
                      options={[
                        { label: 'AP MAC Address', value: 'ap-mac' },
                        { label: 'SSID', value: 'ssid' },
                        { label: 'VLAN ID', value: 'vlan-id' },
                      ]}
                      isRequired
                      w="max-content"
                    />
                  </Box>
                  <SelectField
                    name="remote-id-format"
                    label="Remote ID Format"
                    options={[
                      { label: 'AP MAC Address', value: 'ap-mac' },
                      { label: 'SSID', value: 'ssid' },
                      { label: 'VLAN ID', value: 'vlan-id' },
                    ]}
                    isRequired
                    w="max-content"
                  />
                </Flex>
              </Box>
            }
            columns={columns}
            schema={SERVICES_DHCP_RELAY_VLAN_SCHEMA}
            isDisabled={!isEditing}
            isRequired
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default DhcpRelay;
