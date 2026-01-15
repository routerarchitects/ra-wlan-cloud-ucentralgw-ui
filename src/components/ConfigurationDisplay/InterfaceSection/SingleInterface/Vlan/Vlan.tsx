import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { ObjectShape } from 'yup/lib/object';
// import LockedVlan from './LockedVlan'; // Temporarily disabled
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import { NumberField } from 'components/Form/Fields/NumberField';

interface Props {
  editing: boolean;
  isActive: boolean;
  index: number;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUsingCustom: boolean;
  variableBlock?: string;
  basicSchema: (t: (s: string) => string) => ObjectShape;
}

const VlanForm = (
  {
    editing,
    index,
    isActive,
    onToggle,
    isUsingCustom,
    variableBlock,
    basicSchema
  }: Props
) => (<>
  <Heading size="md" display="flex">
    <Text pt={1}>Vlan</Text>
    <Switch
      pt={1}
      onChange={onToggle}
      isChecked={isActive}
      borderRadius="15px"
      size="lg"
      mx={2}
      isDisabled={!editing}
    />
    {isActive && (
      <ConfigurationResourcePicker
        name={`configuration[${index}].vlan`}
        prefix="interface.vlan"
        isDisabled={!editing}
        defaultValue={basicSchema}
      />
    )}
  </Heading>
  {isActive && isUsingCustom && (
    <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
      <NumberField name={`configuration[${index}].vlan.id`} label="id" isDisabled={!editing} isRequired w={36} />
    </SimpleGrid>
  )}
  {isActive && !isUsingCustom && variableBlock !== undefined && <div style={{ padding: "10px", background: "#FFF3CD", borderRadius: "4px" }}><small>Variable block VLAN (ID: {String(variableBlock)}) - editing temporarily unavailable</small></div>}
</>);

export default React.memo(VlanForm);
