import React, { useMemo } from 'react';
import { HStack } from '@chakra-ui/react';
import { INTERFACE_ETHERNET_SCHEMA } from '../interfacesConstants';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

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

const boolOrUndefined = (defaultVal: boolean, value: boolean | undefined) => {
  if (value === undefined) {
    return defaultVal ? 'Yes' : 'No';
  }

  return value ? 'Yes' : 'No';
};

const tableCols = [
  {
    id: 'select-ports',
    Header: 'Ports',
    Footer: '',
    accessor: 'select-ports',
    Cell: ({ cell }) => cell.row.original['select-ports']?.join(',') ?? 'None',
  },
  {
    id: 'macaddr',
    Header: 'Mac Address',
    Footer: '',
    accessor: 'macaddr',
  },
  {
    id: 'multicast',
    Header: 'Multicast',
    Footer: '',
    accessor: 'multicast',
    Cell: ({ cell }) => boolOrUndefined(true, cell.row.original.multicast),
  },
  {
    id: 'learning',
    Header: 'Learning',
    Footer: '',
    accessor: 'learning',
    Cell: ({ cell }) => boolOrUndefined(true, cell.row.original.learning),
  },
  {
    id: 'reverse-path',
    Header: 'Reverse Path',
    Footer: '',
    accessor: 'reverse-path',
    Cell: ({ cell }) => boolOrUndefined(false, cell.row.original.learning),
  },
  {
    id: 'vlan-tag',
    Header: 'Vlan Tag',
    Footer: '',
    accessor: 'vlan-tag',
    Cell: ({ cell }) => cell.row.original['vlan-tag'] ?? 'Auto',
  },
];

interface Props {
  isDisabled?: boolean;
  name: string;
}

const InterfaceSelectPortsField = ({ name, isDisabled = false }: Props) => {
  const fields = useMemo(
    () => (
      <>
        <MultiSelectField name="select-ports" label="Ports" options={selectPortsOptions} isRequired />
        <StringField name="macaddr" label="Mac Address" w="200px" emptyIsUndefined />
        <HStack spacing={4}>
          <ToggleField name="multicast" label="Multicast" />
          <ToggleField name="learning" label="Learning" />
          <ToggleField name="reverse-path" label="Reverse Path" />
          <SelectField
            name="vlan-tag"
            label="Vlan Tag"
            options={[
              { label: 'Auto', value: 'auto' },
              { label: 'Tagged', value: 'tagged' },
              { label: 'Un-tagged', value: 'un-tagged' },
            ]}
          />
        </HStack>
      </>
    ),
    [],
  );

  return (
    <ObjectArrayFieldModal
      name={name}
      label="ethernet"
      fields={fields}
      columns={tableCols}
      schema={INTERFACE_ETHERNET_SCHEMA}
      isDisabled={isDisabled}
      isRequired
      options={{
        buttonLabel: 'Manage Ethernet Ports',
      }}
    />
  );
};

export default InterfaceSelectPortsField;
