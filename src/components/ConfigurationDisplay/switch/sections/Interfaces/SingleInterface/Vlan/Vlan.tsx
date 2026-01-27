import React, { useCallback } from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { useFastField } from 'hooks/useFastField';
import { INTERFACE_VLAN_SCHEMA } from '../../interfacesConstants';

interface Props {
  editing: boolean;
  index: number;
}

const VlanForm = ({ editing, index }: Props) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: `configuration[${index}].vlan` });
  const isActive = value !== undefined;

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) onChange(undefined);
      else onChange(INTERFACE_VLAN_SCHEMA(t, true).cast());
    },
    [onChange, t],
  );

  return (
    <>
      <Heading size="md" display="flex">
        <Text pt={1}>vlan</Text>
        <Switch
          pt={1}
          onChange={onToggle}
          isChecked={isActive}
          borderRadius="15px"
          size="lg"
          mx={2}
          isDisabled={!editing}
        />
      </Heading>
      {isActive && (
        <SimpleGrid minChildWidth="220px" spacing="20px" mb={8} mt={2} w="100%">
          <NumberField name={`configuration[${index}].vlan.id`} label="id" isDisabled={!editing} isRequired w={36} />
          <SelectField
            name={`configuration[${index}].vlan.proto`}
            label="proto"
            options={[{ value: '802.1q', label: '802.1q' }]}
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      )}
    </>
  );
};

export default React.memo(VlanForm);
