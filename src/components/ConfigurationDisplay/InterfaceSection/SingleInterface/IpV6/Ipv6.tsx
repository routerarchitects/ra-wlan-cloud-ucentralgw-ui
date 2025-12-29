import React, { useCallback, useMemo } from 'react';
import { Box, Flex, FormControl, Heading, Select, SimpleGrid, Spacer, Switch, Text } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { INTERFACE_IPV6_PORT_FORWARD_SCHEMA, INTERFACE_IPV6_TRAFFIC_ALLOW_SCHEMA } from '../../interfacesConstants';
import DhcpIpV6 from './DhcpIpV6';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/Form/Fields/ObjectArrayFieldModal';
import { PortRangeField } from 'components/Form/Fields/PortRangeField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import ArrayCell from 'components/TableCells/ArrayCell';

const IpV6: React.FC<{
  editing: boolean;
  index: number;
  ipv6: string;
  role: string;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ editing, index, ipv6, role, onToggle, onChange }) => {
  const arrCell = useCallback((cell, key) => <ArrayCell arr={cell.row.values[key]} key={uuid()} />, []);

  const portFields = useMemo(
    () => (
      <>
        <Box mb={4}>
          <SelectField
            name="protocol"
            label="protocol"
            definitionKey="interface.ipv6.port-forward.protocol"
            options={[
              { value: 'any', label: 'any' },
              { value: 'tcp', label: 'tcp' },
              { value: 'udp', label: 'udp' },
            ]}
            w="100px"
            isRequired
          />
        </Box>
        <Box mb={4}>
          <PortRangeField name="external-port" label="external-port" isRequired />
        </Box>
        <SimpleGrid minChildWidth="380px" gap={4}>
          <PortRangeField name="internal-port" label="internal-port" isRequired />
          <StringField name="internal-address" label="internal-address" isRequired />
        </SimpleGrid>
      </>
    ),
    [],
  );
  const portCols = useMemo(
    () => [
      {
        id: 'protocol',
        Header: 'protocol',
        Footer: '',
        accessor: 'protocol',
        customWidth: '100px',
      },
      {
        id: 'external-port',
        Header: 'external-port',
        Footer: '',
        accessor: 'external-port',
      },
      {
        id: 'internal-port',
        Header: 'internal-port',
        Footer: '',
        accessor: 'internal-port',
      },
      {
        id: 'internal-address',
        Header: 'internal-address',
        Footer: '',
        accessor: 'internal-address',
        customWidth: '150px',
      },
    ],
    [],
  );
  const portOpts = useMemo(
    () => ({
      buttonLabel: 'IPv6 Port Forwarding',
      modalTitle: 'IPv6 Port Forwarding',
    }),
    [],
  );

  const trafficFields = useMemo(
    () => (
      <>
        <Box mb={4}>
          <SelectField
            name="protocol"
            label="protocol"
            definitionKey="interface.ipv6.port-forward.protocol"
            options={[
              { value: 'any', label: 'any' },
              { value: 'tcp', label: 'tcp' },
              { value: 'udp', label: 'udp' },
            ]}
            w="100px"
            isRequired
          />
        </Box>
        <SimpleGrid minChildWidth="300px" gap={4}>
          <CreatableSelectField
            name="source-ports"
            label="source-ports"
            definitionKey="interface.ipv6.traffic-allow.source-ports"
            isRequired
          />
          <StringField name="source-address" label="source-address" isRequired />
          <CreatableSelectField
            name="destination-ports"
            label="destination-ports"
            definitionKey="interface.ipv6.traffic-allow.destination-ports"
            isRequired
          />
          <StringField name="destination-address" label="destination-address" isRequired />
        </SimpleGrid>
      </>
    ),
    [],
  );
  const trafficCols = useMemo(
    () => [
      {
        id: 'protocol',
        Header: 'protocol',
        Footer: '',
        accessor: 'protocol',
        customWidth: '150px',
      },
      {
        id: 'source-ports',
        Header: 'source-ports',
        Footer: '',
        accessor: 'source-ports',
        Cell: ({ cell }: { cell: unknown }) => arrCell(cell, 'source-ports'),
        customWidth: '150px',
      },
      {
        id: 'source-address',
        Header: 'source-address',
        Footer: '',
        accessor: 'source-address',
        customWidth: '150px',
      },
      {
        id: 'destination-ports',
        Header: 'destination-ports',
        Footer: '',
        accessor: 'destination-ports',
        Cell: ({ cell }: { cell: unknown }) => arrCell(cell, 'destination-ports'),
        customWidth: '150px',
      },
      {
        id: 'destination-address',
        Header: 'destination-address',
        Footer: '',
        accessor: 'destination-address',
        customWidth: '150px',
      },
    ],
    [],
  );

  const trafficOpts = useMemo(
    () => ({
      buttonLabel: 'IPv6 Traffic management',
      modalTitle: 'IPv6 Traffic management',
    }),
    [],
  );

  return (
    <>
      <Heading size="md" display="flex" mt={2}>
        <Text pt={1}>IpV6</Text>
        <Switch
          onChange={onToggle}
          isChecked={ipv6 !== ''}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          pt={1}
          mx={2}
        />
        <FormControl isDisabled={!editing} hidden={ipv6 === ''} w="120px">
          <Select value={ipv6} onChange={onChange} borderRadius="15px" w="120px" fontSize="sm">
            <option value="dynamic">dynamic</option>
            <option value="static">static</option>
          </Select>
        </FormControl>
        {role === 'downstream' && ipv6 !== '' && (
          <Flex>
            <ObjectArrayFieldModal
              name={`configuration[${index}].ipv6.port-forward`}
              label="port-forward"
              fields={portFields}
              columns={portCols}
              options={portOpts}
              schema={INTERFACE_IPV6_PORT_FORWARD_SCHEMA}
              isDisabled={!editing}
              hideLabel
              emptyIsUndefined
              isRequired
            />
            <Spacer w={12} />
            <ObjectArrayFieldModal
              name={`configuration[${index}].ipv6.traffic-allow`}
              label="traffic-allow"
              options={trafficOpts}
              fields={trafficFields}
              columns={trafficCols}
              schema={INTERFACE_IPV6_TRAFFIC_ALLOW_SCHEMA}
              isDisabled={!editing}
              hideLabel
              emptyIsUndefined
              isRequired
            />
          </Flex>
        )}
      </Heading>
      {ipv6 === 'static' && (
        <>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={2} mt={2} w="100%">
            <StringField
              name={`configuration[${index}].ipv6.subnet`}
              label="subnet"
              definitionKey="interface.ipv6.subnet"
              isDisabled={!editing}
              emptyIsUndefined
            />
            <StringField
              name={`configuration[${index}].ipv6.gateway`}
              label="gateway"
              definitionKey="interface.ipv6.gateway"
              isDisabled={!editing}
              emptyIsUndefined
            />
            <NumberField
              name={`configuration[${index}].ipv6.prefix-size`}
              label="prefix-size"
              definitionKey="interface.ipv6.prefix-size"
              acceptEmptyValue
            />
          </SimpleGrid>

          <DhcpIpV6 editing={editing} index={index} />
        </>
      )}
    </>
  );
};

export default React.memo(IpV6);
