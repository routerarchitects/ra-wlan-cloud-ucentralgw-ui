import React from 'react';
import { Box, Flex, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import InterfaceSelectPortsField from './InterfaceSelectPortsField';
import SwitchIpv4 from './SwitchIpv4';
import Vlan from './Vlan';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';

interface Props {
  editing: boolean;
  index: number;
  remove: (e: number) => void;
}

const SingleInterface: React.FC<Props> = ({ editing, index, remove }) => {
  const { t } = useTranslation();
  const removeRadio = () => remove(index);

  return (
    <Box w="100%">
      <Flex>
        <div>
          <Heading size="md" borderBottom="1px solid">
            General
          </Heading>
        </div>
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeRadio} label={t('configurations.delete_interface')} />
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name={`configuration[${index}].name`}
          label="name"
          definitionKey="interface.name"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <SelectField
          name={`configuration[${index}].role`}
          label="role"
          definitionKey="interface.role"
          isDisabled={!editing}
          options={[
            { value: 'upstream', label: 'upstream' },
            { value: 'downstream', label: 'downstream' },
          ]}
          emptyIsUndefined
        />
        <InterfaceSelectPortsField name={`configuration[${index}].ethernet`} isDisabled={!editing} />
        <MultiSelectField
          name={`configuration[${index}].services`}
          label="services"
          definitionKey="interface.services"
          options={[
            {
              value: 'lldp',
              label: 'lldp',
            },
            {
              value: 'ssh',
              label: 'ssh',
            },
          ]}
          isDisabled={!editing}
          emptyIsUndefined
        />
      </SimpleGrid>
      <Flex mt={4} mb={2}>
        <Heading size="md" borderBottom="1px solid">
          IP Addressing
        </Heading>
      </Flex>
      <SwitchIpv4 editing={editing} index={index} />
      <Vlan editing={editing} index={index} />
    </Box>
  );
};

export default React.memo(SingleInterface);
