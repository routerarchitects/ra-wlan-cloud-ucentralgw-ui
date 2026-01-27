import React, { useMemo } from 'react';
import { Box, Flex, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import InterfaceSelectPortsField from './InterfaceSelectPortsField';
import IpV4 from './IpV4';
import IpV6 from './IpV6';
import SsidList from './SsidList';
import Tunnel from './Tunnel';
import Vlan from './Vlan';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';

interface Props {
  editing: boolean;
  index: number;
  remove: (e: number) => void;
}

const SingleInterface: React.FC<Props> = ({ editing, index, remove }) => {
  const { t } = useTranslation();
  const { value } = useFastField<unknown[]>({ name: `configuration[${index}].ssids` });
  const removeRadio = () => remove(index);

  const roleOpts = useMemo(
    () => [
      { value: 'upstream', label: 'upstream' },
      { value: 'downstream', label: 'downstream' },
    ],
    [],
  );
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
          isRequired
        />
        <SelectField
          name={`configuration[${index}].role`}
          label="role"
          definitionKey="interface.role"
          isDisabled
          isRequired
          options={roleOpts}
        />
        <InterfaceSelectPortsField name={`configuration[${index}].ethernet`} isDisabled={!editing} />
        <ToggleField
          name={`configuration[${index}].isolate-hosts`}
          label="isolate-hosts"
          definitionKey="interface.isolate-hosts"
          isDisabled={!editing}
          falseIsUndefined
        />
        <MultiSelectField
          name={`configuration[${index}].services`}
          label="services"
          definitionKey="interface.services"
          options={[
            {
              value: 'dhcp-snooping',
              label: 'dhcp-snooping',
            },
            {
              value: 'http',
              label: 'http',
            },
            {
              value: 'ieee8021x',
              label: 'ieee8021x',
            },
            {
              value: 'igmp',
              label: 'igmp',
            },
            {
              value: 'lldp',
              label: 'lldp',
            },
            {
              value: 'mdns',
              label: 'mdns',
            },
            {
              value: 'ntp',
              label: 'ntp',
            },
            {
              value: 'ssh',
              label: 'ssh',
            },
            {
              value: 'vxlan-overlay',
              label: 'vxlan-overlay',
            },
            {
              value: 'wireguard-overlay',
              label: 'wireguard-overlay',
            },
          ]}
          isDisabled={!editing}
          emptyIsUndefined
        />
        <CreatableSelectField
          name={`configuration[${index}].hostapd-bss-raw`}
          label="hostapd-bss-raw"
          definitionKey="interface.hostapd-bss-raw"
          isDisabled={!editing}
          emptyIsUndefined
        />
      </SimpleGrid>
      <Flex mt={4} mb={2}>
        <Heading size="md" borderBottom="1px solid">
          IP Addressing
        </Heading>
      </Flex>
      <IpV4 editing={editing} index={index} />
      <IpV6 editing={editing} index={index} />
      <Flex mt={4} mb={2}>
        <Heading size="md" borderBottom="1px solid">
          Advanced Settings
        </Heading>
      </Flex>
      <Vlan editing={editing} index={index} />
      <Tunnel editing={editing} index={index} />
      <FieldArray name={`configuration[${index}].ssids`}>
        {(arrayHelpers) => (
          <SsidList
            index={index}
            editing={editing}
            arrayHelpers={arrayHelpers}
            ssidsLength={value !== undefined ? value.length : 0}
          />
        )}
      </FieldArray>
    </Box>
  );
};

export default React.memo(SingleInterface);
