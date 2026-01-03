import React from 'react';
import { Heading, Image, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { INTERFACE_PASSPOINT_ICONS_SCHEMA } from '../../../interfacesConstants';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import ImageField from 'components/FormFields/ImageField';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

interface Props {
  isDisabled?: boolean;
  namePrefix: string;
  isEnabled: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lockConsortium?: boolean;
}

const PassPointForm: React.FC<Props> = ({ isDisabled, namePrefix, isEnabled, onToggle, lockConsortium }) => {
  const name = React.useCallback((suffix: string) => `${namePrefix}.${suffix}`, []);

  const fieldProps = (suffix: string) => ({
    name: name(suffix),
    label: suffix,
    definitionKey: `interface.ssid.pass-point.${suffix}`,
    isDisabled,
  });

  const iconCell = React.useCallback(
    (src: string, fileType: string) => (
      <Image boxSize={100} mx="auto" my="auto" src={`data:${fileType ?? 'image/png'};base64,${src}`} alt="New Image" />
    ),
    [],
  );
  const iconFields = React.useMemo(
    () => (
      <>
        <SimpleGrid minChildWidth="180px" gap={4} mb={4}>
          <NumberField name="width" label="width" w="140px" emptyIsUndefined isRequired unit="px" />
          <NumberField name="height" label="height" w="140px" isRequired unit="px" />
          <StringField name="language" label="language" isRequired />
        </SimpleGrid>
        <ImageField name="icon" heightName="height" widthName="width" typeName="type" />
      </>
    ),
    [],
  );
  const iconCols = React.useMemo(
    () => [
      {
        id: 'icon',
        Header: 'icon',
        Footer: '',
        Cell: ({
          cell,
        }: {
          cell: {
            row: {
              original: {
                icon: string;
                type: string;
              };
            };
          };
        }) => iconCell(cell.row.original.icon, cell.row.original.type),
        accessor: 'icon',
      },
      {
        id: 'type',
        Header: 'type',
        Footer: '',
        accessor: 'type',
        customWidth: '100px',
      },
      {
        id: 'width',
        Header: 'width',
        Footer: '',
        accessor: 'width',
        customWidth: '150px',
      },
      {
        id: 'height',
        Header: 'height',
        Footer: '',
        accessor: 'height',
        customWidth: '100px',
      },
      {
        id: 'language',
        Header: 'language',
        Footer: '',
        accessor: 'language',
        customWidth: '100px',
      },
    ],
    [],
  );

  return (
    <>
      <Heading size="md" display="flex">
        <Text mr={2} borderBottom="1px solid">
          Pass Point
        </Text>
        <Switch
          onChange={onToggle}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          isDisabled={isDisabled}
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <CreatableSelectField
            {...fieldProps('venue-name')}
            emptyIsUndefined
            placeholder="eng:Example passpoint_venue"
          />
          <CreatableSelectField
            {...fieldProps('venue-url')}
            emptyIsUndefined
            placeholder="http://www.example.com/info-fra"
          />
          <NumberField {...fieldProps('venue-group')} w="80px" acceptEmptyValue emptyIsUndefined isRequired />
          <NumberField {...fieldProps('venue-type')} w="80px" acceptEmptyValue emptyIsUndefined isRequired />
          <NumberField {...fieldProps('access-network-type')} w="80px" acceptEmptyValue emptyIsUndefined isRequired />
          <SelectField
            {...fieldProps('auth-type.type')}
            options={[
              { value: 'terms-and-conditions', label: 'Terms and Conditions' },
              { value: 'online-enrollment', label: 'Online Enrollment' },
              { value: 'http-redirection', label: 'HTTP Redirection' },
              { value: 'dns-redirection', label: 'DNS Redirection' },
            ]}
            w="200px"
            isRequired
          />
          <StringField {...fieldProps('auth-type.url')} emptyIsUndefined isDisabled={isDisabled} />
          <CreatableSelectField {...fieldProps('domain-name')} emptyIsUndefined placeholder="test.com" />
          <CreatableSelectField {...fieldProps('nai-realm')} placeholder="test.com" />
          <ToggleField {...fieldProps('osen')} emptyIsUndefined />
          <NumberField {...fieldProps('anqp-domain')} isRequired />
          <CreatableSelectField {...fieldProps('anqp-3gpp-cell-net')} emptyIsUndefined placeholder="310,410" />
          <CreatableSelectField {...fieldProps('friendly-name')} emptyIsUndefined placeholder="eng:TestLabs" />
          <ToggleField {...fieldProps('internet')} />
          <ToggleField {...fieldProps('asra')} falseIsUndefined />
          <ToggleField {...fieldProps('esr')} falseIsUndefined />
          <ToggleField {...fieldProps('uesa')} falseIsUndefined />
          <StringField {...fieldProps('hessid')} emptyIsUndefined />
          <CreatableSelectField
            {...fieldProps('roaming-consortium')}
            emptyIsUndefined
            placeholder="BAA2D00100"
            isDisabled={lockConsortium || isDisabled}
          />
          <ToggleField {...fieldProps('disable-dgaf')} falseIsUndefined />
          <NumberField {...fieldProps('ipaddr-type-available')} acceptEmptyValue emptyIsUndefined />
          <SelectField
            {...fieldProps('wan-metrics.type')}
            options={[
              { value: 'up', label: 'up' },
              { value: 'down', label: 'down' },
              { value: 'testing', label: 'testing' },
            ]}
            w="100px"
            isRequired
          />
          <NumberField
            {...fieldProps('wan-metrics.downlink')}
            w="150px"
            unit="kbps"
            isRequired
            acceptEmptyValue
            emptyIsUndefined
          />
          <NumberField
            {...fieldProps('wan-metrics.uplink')}
            w="150px"
            unit="kbps"
            isRequired
            acceptEmptyValue
            emptyIsUndefined
          />
          <CreatableSelectField {...fieldProps('connection-capability')} emptyIsUndefined placeholder="17:5060:0" />
          <ObjectArrayFieldModal
            {...fieldProps('icons')}
            fields={iconFields}
            // @ts-ignore
            columns={iconCols}
            schema={INTERFACE_PASSPOINT_ICONS_SCHEMA}
            emptyIsUndefined
          />
        </SimpleGrid>
      )}
    </>
  );
};

export default React.memo(PassPointForm);
