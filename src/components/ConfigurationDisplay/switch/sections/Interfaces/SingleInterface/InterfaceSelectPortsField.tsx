import React, { useMemo } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { INTERFACE_ETHERNET_SCHEMA } from '../interfacesConstants';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const selectPortsOptions = Array.from({ length: 41 }, (_, i) => ({
  value: `Ethernet${i}`,
  label: `Ethernet${i}`,
}));

interface Props {
  isDisabled?: boolean;
  name: string;
}

const InterfaceSelectPortsField = ({ name, isDisabled = false }: Props) => {
  const fields = useMemo(
    () => (
      <>
        <MultiSelectField name="select-ports" label="Ports" options={selectPortsOptions} isRequired />
        <SimpleGrid minChildWidth="220px" spacing={4}>
          <SelectField
            name="vlan-tag"
            label="vlan-tag"
            options={[
              { label: 'tagged', value: 'tagged' },
              { label: 'un-tagged', value: 'un-tagged' },
            ]}
            isRequired
          />
          <ToggleField name="pvid" label="pvid" />
        </SimpleGrid>
      </>
    ),
    [],
  );

  return (
    <ObjectArrayFieldModal
      name={name}
      label="ethernet"
      fields={fields}
      columns={[
        {
          id: 'select-ports',
          Header: 'Ports',
          Footer: '',
          accessor: 'select-ports',
          Cell: ({ cell }) => cell.row.original['select-ports']?.join(',') ?? 'None',
        },
        {
          id: 'vlan-tag',
          Header: 'Vlan Tag',
          Footer: '',
          accessor: 'vlan-tag',
          Cell: ({ cell }) => cell.row.original['vlan-tag'] ?? 'un-tagged',
        },
        {
          id: 'pvid',
          Header: 'PVID',
          Footer: '',
          accessor: 'pvid',
          Cell: ({ cell }) => (cell.row.original.pvid ? 'Yes' : 'No'),
        },
      ]}
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
