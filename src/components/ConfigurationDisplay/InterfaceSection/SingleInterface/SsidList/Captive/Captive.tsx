import React from 'react';
import { Heading, Select, SimpleGrid, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import FileInputFieldModal from 'components/Form/Fields/FileInputFieldModal';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/Form/Fields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const CREDENTIALS_SCHEMA = (t: (str: string) => string, useDefault = false) => {
  const shape = object().shape({
    username: string().required(t('form.required')).default(''),
    password: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

interface Props {
  isDisabled?: boolean;
  namePrefix: string;
  onAuthModeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  authMode?: string;
}

const CaptiveForm = ({ isDisabled, namePrefix, onAuthModeChange, authMode }: Props) => {
  const fieldProps = (suffix: string) => ({
    name: `${namePrefix}.${suffix}`,
    label: suffix,
    definitionKey: `interface.ssid.pass-point.${suffix}`,
    isDisabled,
  });
  const { t } = useTranslation();

  const credFields = React.useMemo(
    () => (
      <SimpleGrid minChildWidth="300px" gap={4}>
        <StringField name="username" label="username" isRequired />
        <StringField name="password" label="password" isRequired />
      </SimpleGrid>
    ),
    [],
  );
  const credCols = React.useMemo(
    () => [
      {
        id: 'username',
        Header: 'username',
        Footer: '',
        accessor: 'username',
      },
      {
        id: 'password',
        Header: 'password',
        Footer: '',
        accessor: 'password',
      },
    ],
    [],
  );

  return (
    <>
      <Heading size="md" display="flex" alignItems="center" mt={2}>
        <Text pt={1}>Captive Portal</Text>
        <Select w="max-content" ml={2} value={authMode} onChange={onAuthModeChange} isDisabled={isDisabled}>
          <option value="none">None</option>
          <option value="click-to-continue">Click</option>
          <option value="radius">Radius</option>
          <option value="credentials">Credentials</option>
          <option value="uam">UAM</option>
        </Select>
      </Heading>
      {authMode !== undefined && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <CreatableSelectField
            {...fieldProps('walled-garden-fqdn')}
            placeholder="Example: *.google.com"
            emptyIsUndefined={authMode !== 'uam'}
            isRequired={authMode === 'uam'}
          />
          <CreatableSelectField
            {...fieldProps('walled-garden-ipaddr')}
            placeholder="Example: 192.168.0.1"
            emptyIsUndefined
          />
          <FileInputFieldModal
            {...fieldProps('web-root')}
            fileName="configuration.captive.web-root-filename"
            definitionKey="service.captive.web-root"
            explanation={t('form.captive_web_root_explanation')}
            test={() => true}
            acceptedFileTypes=".tar"
            isDisabled={isDisabled}
            canDelete
            isRequired
            wantBase64
          />
          <NumberField {...fieldProps('idle-timeout')} emptyIsUndefined acceptEmptyValue w="100px" />
          <NumberField {...fieldProps('session-timeout')} emptyIsUndefined acceptEmptyValue w="100px" />
          {authMode === 'credentials' && (
            <ObjectArrayFieldModal
              {...fieldProps('credentials')}
              fields={credFields}
              columns={credCols}
              schema={CREDENTIALS_SCHEMA}
              isDisabled={isDisabled}
              isRequired
            />
          )}
          {authMode === 'uam' && (
            <>
              <StringField {...fieldProps('uam-server')} isRequired />
              <StringField {...fieldProps('uam-secret')} hideButton />
              <NumberField {...fieldProps('uam-port')} isRequired />
              <StringField {...fieldProps('nasid')} isRequired />
              <StringField {...fieldProps('nasmac')} emptyIsUndefined />
              <SelectField
                {...fieldProps('mac-format')}
                options={[
                  { value: 'aabbccddeeff', label: 'aabbccddeeff' },
                  { value: 'aa-bb-cc-dd-ee-ff', label: 'aa-bb-cc-dd-ee-ff' },
                  { value: 'aa:bb:cc:dd:ee:ff', label: 'aa:bb:cc:dd:ee:ff' },
                  { value: 'AABBCCDDEEFF', label: 'AABBCCDDEEFF' },
                  { value: 'AA:BB:CC:DD:EE:FF', label: 'AA:BB:CC:DD:EE:FF' },
                  { value: 'AA-BB-CC-DD-EE-FF', label: 'AA-BB-CC-DD-EE-FF' },
                ]}
                isRequired
              />
              <StringField {...fieldProps('ssid')} emptyIsUndefined />
              <StringField {...fieldProps('final-redirect-url')} emptyIsUndefined />
              <ToggleField
                name={`${namePrefix}.mac-auth`}
                label="mac-auth"
                definitionKey="interface.ssid.captive.mac-auth"
                isDisabled={isDisabled}
              />
            </>
          )}
          {(authMode === 'radius' || authMode === 'uam') && (
            <>
              <StringField {...fieldProps('auth-server')} isRequired />
              <StringField {...fieldProps('auth-secret')} isRequired hideButton />
              <NumberField {...fieldProps('auth-port')} isRequired />
              <StringField {...fieldProps('acct-server')} emptyIsUndefined />
              <StringField {...fieldProps('acct-secret')} emptyIsUndefined hideButton />
              <NumberField {...fieldProps('acct-port')} emptyIsUndefined acceptEmptyValue />
              <NumberField {...fieldProps('acct-interval')} emptyIsUndefined acceptEmptyValue />
            </>
          )}
        </SimpleGrid>
      )}
    </>
  );
};

export default React.memo(CaptiveForm);
