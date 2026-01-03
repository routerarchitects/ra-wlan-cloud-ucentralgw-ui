import React, { useMemo } from 'react';
import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_MULTIPSK_SCHEMA, NO_MULTI_PROTOS } from '../../interfacesConstants';
import AccessControlList from './AccessControlList';
import Captive from './Captive';
import RateLimit from './RateLimit';
import Roaming from './Roaming';
import Rrm from './Rrm';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';

const AdvancedSettings: React.FC<{ editing: boolean; namePrefix: string }> = ({ editing, namePrefix }) => {
  const { t } = useTranslation();
  const { value: proto } = useFastField({ name: `${namePrefix}.encryption.proto` });

  const pskFields = useMemo(
    () => (
      <SimpleGrid minChildWidth="300px" gap={4}>
        <StringField name="mac" label="mac" emptyIsUndefined />
        <StringField name="key" label="key" isRequired />
        <NumberField name="vlan-id" label="vlan-id" isRequired />
      </SimpleGrid>
    ),
    [],
  );
  const pskCols = useMemo(
    () => [
      {
        id: 'mac',
        Header: 'mac',
        Footer: '',
        accessor: 'mac',
      },
      {
        id: 'key',
        Header: 'key',
        Footer: '',
        accessor: 'key',
        customWidth: '150px',
      },
      {
        id: 'vlan-id',
        Header: 'vlan-id',
        Footer: '',
        accessor: 'vlan-id',
        customWidth: '100px',
      },
    ],
    [],
  );
  return (
    <>
      <Flex mt={4}>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.advanced_settings')}
        </Heading>
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb="20px">
        <ToggleField
          name={`${namePrefix}.hidden-ssid`}
          label="hidden-ssid"
          definitionKey="interface.ssid.hidden-ssid"
          isDisabled={!editing}
          isRequired
        />
        <MultiSelectField
          name={`${namePrefix}.services`}
          label="services"
          definitionKey="interface.ssid.services"
          isDisabled={!editing}
          options={[
            { value: 'radius-gw-proxy', label: 'radius-gw-proxy' },
            { value: 'wifi-steering', label: 'wifi-steering' },
            { value: 'captive', label: 'captive' },
          ]}
        />
        <NumberField
          name={`${namePrefix}.maximum-clients`}
          label="maximum-clients"
          definitionKey="interface.ssid.maximum-clients"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name={`${namePrefix}.fils-discovery-interval`}
          label="fils-discovery-interval"
          definitionKey="interface.ssid.fils-discovery-interval"
          isDisabled={!editing}
          emptyIsUndefined
          acceptEmptyValue
        />
        <SelectField
          name={`${namePrefix}.purpose`}
          label="purpose"
          definitionKey="interface.ssid.purpose"
          isDisabled={!editing}
          options={[
            { value: '', label: t('common.default') },
            { value: 'user-defined', label: 'user-defined' },
            { value: 'onboarding-ap', label: 'onboarding-ap' },
            { value: 'onboarding-sta', label: 'onboarding-sta' },
          ]}
          emptyIsUndefined
        />
        <NumberField
          name={`${namePrefix}.dtim-period`}
          label="dtim-period"
          definitionKey="radio.dtim-period"
          isDisabled={!editing}
          emptyIsUndefined
          acceptEmptyValue
          w={24}
        />
        <ToggleField
          name={`${namePrefix}.isolate-clients`}
          label="isolate-clients"
          definitionKey="interface.ssid.isolate-clients"
          isDisabled={!editing}
          isRequired
          falseIsUndefined
        />
        <ToggleField
          name={`${namePrefix}.power-save`}
          label="power-save"
          definitionKey="interface.ssid.power-save"
          isDisabled={!editing}
          falseIsUndefined
        />
        <ToggleField
          name={`${namePrefix}.broadcast-time`}
          label="broadcast-time"
          definitionKey="interface.ssid.broadcast-time"
          isDisabled={!editing}
          falseIsUndefined
        />
        <ToggleField
          name={`${namePrefix}.unicast-conversion`}
          label="unicast-conversion"
          definitionKey="interface.ssid.unicast-conversion"
          isDisabled={!editing}
          falseIsUndefined
        />
        <ToggleField
          name={`${namePrefix}.proxy-arp`}
          label="proxy-arp"
          definitionKey="interface.ssid.proxy-arp"
          isDisabled={!editing}
          falseIsUndefined
        />
        <ToggleField
          name={`${namePrefix}.disassoc-low-ack`}
          label="disassoc-low-ack"
          definitionKey="interface.ssid.disassoc-low-ack"
          isDisabled={!editing}
          falseIsUndefined
        />
        <StringField
          name={`${namePrefix}.vendor-elements`}
          label="vendor-elements"
          definitionKey="interface.ssid.vendor-elements"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <ToggleField
          name={`${namePrefix}.tip-information-element`}
          label="tip-information-element"
          definitionKey="interface.ssid.tip-information-element"
          isDisabled={!editing}
          defaultValue
        />
        {!NO_MULTI_PROTOS.includes(proto as string) && (
          <ObjectArrayFieldModal
            name={`${namePrefix}.multi-psk`}
            label="multi-psk"
            fields={pskFields}
            columns={pskCols}
            schema={INTERFACE_SSID_MULTIPSK_SCHEMA}
            isDisabled={!editing}
            emptyIsUndefined
            isRequired
          />
        )}
      </SimpleGrid>
      <RateLimit editing={editing} namePrefix={`${namePrefix}.rate-limit`} />
      <Rrm editing={editing} namePrefix={`${namePrefix}.rrm`} />
      <Captive editing={editing} namePrefix={`${namePrefix}.captive`} />
      <AccessControlList editing={editing} namePrefix={`${namePrefix}.access-control-list`} />
      <Roaming editing={editing} namePrefix={`${namePrefix}.roaming`} />
    </>
  );
};

export default AdvancedSettings;
