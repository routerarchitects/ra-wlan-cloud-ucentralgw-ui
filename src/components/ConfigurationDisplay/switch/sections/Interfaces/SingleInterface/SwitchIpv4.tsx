import React, { useCallback, useMemo } from 'react';
import { Box, Flex, Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  INTERFACE_IPV4_SCHEMA,
  INTERFACE_IPV4_SUBNET_SCHEMA,
  INTERFACE_IPV4_GATEWAY_SCHEMA,
  INTERFACE_IPV4_BROADCAST_SCHEMA,
  INTERFACE_IGMP_GROUP_SCHEMA,
  INTERFACE_IPV4_DHCP_SCHEMA,
  INTERFACE_IPV4_IGMP_SCHEMA,
} from '../interfacesConstants';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';
import { useFormikContext } from 'formik';

const PORT_OPTIONS = Array.from({ length: 41 }, (_, i) => ({
  value: `Ethernet${i}`,
  label: `Ethernet${i}`,
}));

const SwitchIpv4: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();
  const { value: ipv4, onChange } = useFastField({ name: `configuration[${index}].ipv4` });
  const { setFieldValue } = useFormikContext();
  const isEnabled = ipv4 !== undefined;
  const hasDhcp = ipv4?.dhcp !== undefined;
  const hasIgmp = Boolean(ipv4?.multicast?.igmp);

  const toggleIpv4 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange(INTERFACE_IPV4_SCHEMA(t, true).cast());
      }
    },
    [onChange, t],
  );

  const toggleDhcp = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(
        `configuration[${index}].ipv4.dhcp`,
        e.target.checked ? INTERFACE_IPV4_DHCP_SCHEMA(t, true).cast() : undefined,
      );
    },
    [index, setFieldValue, t],
  );

  const toggleIgmp = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(
        `configuration[${index}].ipv4.multicast`,
        e.target.checked ? { igmp: INTERFACE_IPV4_IGMP_SCHEMA(t, true).cast() } : undefined,
      );
    },
    [index, setFieldValue, t],
  );

  const subnetFields = useMemo(
    () => (
      <>
        <StringField name="prefix" label="prefix" isRequired />
        <NumberField name="vrf" label="vrf" isDisabled={!editing} />
      </>
    ),
    [editing],
  );

  const subnetCols = useMemo(
    () => [
      { id: 'prefix', Header: 'prefix', accessor: 'prefix' },
      { id: 'vrf', Header: 'vrf', accessor: 'vrf' },
    ],
    [],
  );

  const gatewayFields = useMemo(
    () => (
      <>
        <StringField name="prefix" label="prefix" isRequired />
        <StringField name="nexthop" label="nexthop" isRequired />
        <NumberField name="vrf" label="vrf" isDisabled={!editing} />
        <NumberField name="metric" label="metric" isDisabled={!editing} />
      </>
    ),
    [editing],
  );

  const gatewayCols = useMemo(
    () => [
      { id: 'prefix', Header: 'prefix', accessor: 'prefix' },
      { id: 'nexthop', Header: 'nexthop', accessor: 'nexthop' },
      { id: 'vrf', Header: 'vrf', accessor: 'vrf' },
      { id: 'metric', Header: 'metric', accessor: 'metric' },
    ],
    [],
  );

  const broadcastFields = useMemo(
    () => (
      <>
        <StringField name="prefix" label="prefix" isRequired />
        <NumberField name="vrf" label="vrf" isDisabled={!editing} />
      </>
    ),
    [editing],
  );

  const broadcastCols = useMemo(
    () => [
      { id: 'prefix', Header: 'prefix', accessor: 'prefix' },
      { id: 'vrf', Header: 'vrf', accessor: 'vrf' },
    ],
    [],
  );

  const igmpGroupFields = useMemo(
    () => (
      <>
        <StringField name="address" label="address" isRequired />
        <MultiSelectField name="egress-ports" label="egress-ports" options={PORT_OPTIONS} isRequired />
      </>
    ),
    [],
  );

  const igmpGroupCols = useMemo(
    () => [
      { id: 'address', Header: 'address', accessor: 'address' },
      { id: 'egress-ports', Header: 'egress-ports', accessor: 'egress-ports' },
    ],
    [],
  );

  return (
    <Box w="100%">
      <Heading size="md" display="flex" flexWrap={{ base: 'wrap', md: 'nowrap' }} gap={{ base: 2, md: 0 }}>
        <Text pt={1}>ipv4</Text>
        <Switch
          onChange={toggleIpv4}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          pt={1}
          mx={2}
        />
      </Heading>
      {isEnabled && (
        <>
          <ObjectArrayFieldModal
            name={`configuration[${index}].ipv4.subnet`}
            label="subnet"
            fields={subnetFields}
            columns={subnetCols}
            schema={INTERFACE_IPV4_SUBNET_SCHEMA}
            isDisabled={!editing}
            isRequired
            options={{ buttonLabel: 'Manage Subnets', modalTitle: 'Subnets' }}
          />
          <ObjectArrayFieldModal
            name={`configuration[${index}].ipv4.gateway`}
            label="gateway"
            fields={gatewayFields}
            columns={gatewayCols}
            schema={INTERFACE_IPV4_GATEWAY_SCHEMA}
            isDisabled={!editing}
            options={{ buttonLabel: 'Manage Gateways', modalTitle: 'Gateways' }}
          />
          <ObjectArrayFieldModal
            name={`configuration[${index}].ipv4.broadcast`}
            label="broadcast"
            fields={broadcastFields}
            columns={broadcastCols}
            schema={INTERFACE_IPV4_BROADCAST_SCHEMA}
            isDisabled={!editing}
            options={{ buttonLabel: 'Manage Broadcasts', modalTitle: 'Broadcasts' }}
          />
          <Flex align="center" mt={4} mb={2}>
            <Text fontWeight="bold" mr={2}>
              dhcp relay
            </Text>
            <Switch isChecked={hasDhcp} onChange={toggleDhcp} isDisabled={!editing} />
          </Flex>
          {hasDhcp && (
            <SimpleGrid minChildWidth="260px" spacing="20px" mb={4} w="100%">
              <StringField
                name={`configuration[${index}].ipv4.dhcp.relay-server`}
                label="relay-server"
                isRequired
                isDisabled={!editing}
              />
              <StringField
                name={`configuration[${index}].ipv4.dhcp.circuit-id-format`}
                label="circuit-id-format"
                isRequired
                isDisabled={!editing}
              />
            </SimpleGrid>
          )}
          <Flex align="center" mt={4} mb={2}>
            <Text fontWeight="bold" mr={2}>
              igmp
            </Text>
            <Switch isChecked={hasIgmp} onChange={toggleIgmp} isDisabled={!editing} />
          </Flex>
          {hasIgmp && (
            <>
              <SimpleGrid minChildWidth="220px" spacing="20px" mb={4} w="100%">
                <ToggleField
                  name={`configuration[${index}].ipv4.multicast.igmp.snooping-enable`}
                  label="snooping-enable"
                  isDisabled={!editing}
                />
                <ToggleField
                  name={`configuration[${index}].ipv4.multicast.igmp.querier-enable`}
                  label="querier-enable"
                  isDisabled={!editing}
                />
                <ToggleField
                  name={`configuration[${index}].ipv4.multicast.igmp.fast-leave-enable`}
                  label="fast-leave-enable"
                  isDisabled={!editing}
                />
                <NumberField
                  name={`configuration[${index}].ipv4.multicast.igmp.query-interval`}
                  label="query-interval"
                  isDisabled={!editing}
                  isRequired
                />
                <NumberField
                  name={`configuration[${index}].ipv4.multicast.igmp.last-member-query-interval`}
                  label="last-member-query-interval"
                  isDisabled={!editing}
                  isRequired
                />
                <NumberField
                  name={`configuration[${index}].ipv4.multicast.igmp.max-response-time`}
                  label="max-response-time"
                  isDisabled={!editing}
                  isRequired
                />
                <NumberField
                  name={`configuration[${index}].ipv4.multicast.igmp.version`}
                  label="version"
                  isDisabled={!editing}
                  isRequired
                />
              </SimpleGrid>
              <ObjectArrayFieldModal
                name={`configuration[${index}].ipv4.multicast.igmp.static-mcast-groups`}
                label="static-mcast-groups"
                fields={igmpGroupFields}
                columns={igmpGroupCols}
                schema={INTERFACE_IGMP_GROUP_SCHEMA}
                isDisabled={!editing}
                options={{ buttonLabel: 'Manage Static Groups', modalTitle: 'Static IGMP Groups' }}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default React.memo(SwitchIpv4);
