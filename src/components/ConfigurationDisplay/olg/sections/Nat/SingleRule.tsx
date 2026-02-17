import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, SimpleGrid, Spacer, Switch } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['snat', 'dnat']).isRequired,
};

const SingleRule = ({ editing, index, remove, mode }) => {
  const removeRule = () => remove(index);
  const basePath = `configuration.${mode}.rules[${index}]`;
  const interfaceKey = mode === 'dnat' ? 'in-interface' : 'out-interface';
  const { value } = useFastField({ name: basePath });
  const { setFieldValue } = useFormikContext();
  const [showInterface, setShowInterface] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [showSourceGroup, setShowSourceGroup] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [showDestinationGroup, setShowDestinationGroup] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTranslationRedirect, setShowTranslationRedirect] = useState(false);
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);

  useEffect(() => {
    setShowInterface(Boolean(value?.[interfaceKey]));
    setShowSource(
      Boolean(
        value?.source ||
        value?.source?.address ||
          value?.source?.port ||
          value?.source?.fqdn ||
          value?.source?.group?.['port-group'] ||
          value?.source?.group?.['network-group'] ||
          value?.source?.group?.['mac-group'] ||
          value?.source?.group?.['domain-group'] ||
          value?.source?.group?.['address-group'],
      ),
    );
    setShowSourceGroup(
      Boolean(
        value?.source?.group?.['port-group'] ||
          value?.source?.group?.['network-group'] ||
          value?.source?.group?.['mac-group'] ||
          value?.source?.group?.['domain-group'] ||
          value?.source?.group?.['address-group'],
      ),
    );
    setShowDestination(
      Boolean(
        value?.destination?.address ||
          value?.destination?.port ||
          value?.destination?.fqdn ||
          value?.destination?.group?.['port-group'] ||
          value?.destination?.group?.['network-group'] ||
          value?.destination?.group?.['mac-group'] ||
          value?.destination?.group?.['domain-group'] ||
          value?.destination?.group?.['address-group'],
      ),
    );
    setShowDestinationGroup(
      Boolean(
        value?.destination?.group?.['port-group'] ||
          value?.destination?.group?.['network-group'] ||
          value?.destination?.group?.['mac-group'] ||
          value?.destination?.group?.['domain-group'] ||
          value?.destination?.group?.['address-group'],
      ),
    );
    setShowTranslation(Boolean(value?.translation));
    setShowTranslationRedirect(Boolean(value?.translation?.redirect?.port));
    setShowTranslationOptions(
      Boolean(value?.translation?.options?.['port-mapping'] || value?.translation?.options?.['address-mapping']),
    );
  }, [interfaceKey, value]);

  const onToggleInterface = (checked) => {
    setShowInterface(checked);
    if (!checked) setFieldValue(`${basePath}.${interfaceKey}`, undefined);
  };

  const onToggleSource = (checked) => {
    setShowSource(checked);
    if (!checked) {
      setShowSourceGroup(false);
      setFieldValue(`${basePath}.source`, undefined);
    }
  };

  const onToggleSourceGroup = (checked) => {
    setShowSourceGroup(checked);
    if (!checked) setFieldValue(`${basePath}.source.group`, undefined);
  };

  const onToggleDestination = (checked) => {
    setShowDestination(checked);
    if (!checked) {
      setShowDestinationGroup(false);
      setFieldValue(`${basePath}.destination`, undefined);
    }
  };

  const onToggleDestinationGroup = (checked) => {
    setShowDestinationGroup(checked);
    if (!checked) setFieldValue(`${basePath}.destination.group`, undefined);
  };

  const onToggleTranslation = (checked) => {
    setShowTranslation(checked);
    if (!checked) {
      setShowTranslationRedirect(false);
      setShowTranslationOptions(false);
      setFieldValue(`${basePath}.translation`, undefined);
    }
  };

  const onToggleTranslationRedirect = (checked) => {
    setShowTranslationRedirect(checked);
    if (!checked) setFieldValue(`${basePath}.translation.redirect`, undefined);
  };

  const onToggleTranslationOptions = (checked) => {
    setShowTranslationOptions(checked);
    if (!checked) setFieldValue(`${basePath}.translation.options`, undefined);
  };

  return (
    <>
      <Flex>
        <Heading size="md" borderBottom="1px solid">
          {mode === 'dnat' ? 'DNAT Rule' : 'SNAT Rule'}
        </Heading>
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeRule} label="Delete Rule" />
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
        <NumberField name={`${basePath}.rule-id`} label="rule-id" isDisabled={!editing} isRequired min={1} />
        <ToggleField name={`${basePath}.disable`} label="disable" isDisabled={!editing} />
        <SelectField
          name={`${basePath}.protocol`}
          label="protocol"
          isDisabled={!editing}
          options={[
            { value: 'all', label: 'all' },
            { value: 'tcp', label: 'tcp' },
            { value: 'udp', label: 'udp' },
          ]}
        />
      </SimpleGrid>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">
            {interfaceKey} <Box as="span" color="red.300">*</Box>
          </Heading>
          <Switch isChecked={showInterface} onChange={(e) => onToggleInterface(e.target.checked)} isDisabled={!editing} />
        </Flex>
        {showInterface && (
          <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
            <StringField
              name={`${basePath}.${interfaceKey}.name`}
              label="name"
              isDisabled={!editing}
              isRequired
              emptyIsUndefined
            />
            <StringField name={`${basePath}.${interfaceKey}.group`} label="group" isDisabled={!editing} emptyIsUndefined />
          </SimpleGrid>
        )}
      </Box>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">source <Box as="span" color="red.300">*</Box></Heading>
          <Switch isChecked={showSource} onChange={(e) => onToggleSource(e.target.checked)} isDisabled={!editing} />
        </Flex>
        {showSource && (
          <>
            <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
              <StringField
                name={`${basePath}.source.address`}
                label="address"
                isDisabled={!editing}
                isRequired
                emptyIsUndefined
              />
              <StringField name={`${basePath}.source.port`} label="port" isDisabled={!editing} emptyIsUndefined />
              <StringField name={`${basePath}.source.fqdn`} label="fqdn" isDisabled={!editing} emptyIsUndefined />
            </SimpleGrid>

            <Box mt={3} w="100%">
              <Flex alignItems="center" gap={3}>
                <Heading size="xs">source-group</Heading>
                <Switch
                  isChecked={showSourceGroup}
                  onChange={(e) => onToggleSourceGroup(e.target.checked)}
                  isDisabled={!editing}
                />
              </Flex>
              {showSourceGroup && (
                <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
                  <StringField name={`${basePath}.source.group.port-group`} label="port-group" isDisabled={!editing} emptyIsUndefined />
                  <StringField
                    name={`${basePath}.source.group.network-group`}
                    label="network-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                  <StringField name={`${basePath}.source.group.mac-group`} label="mac-group" isDisabled={!editing} emptyIsUndefined />
                  <StringField
                    name={`${basePath}.source.group.domain-group`}
                    label="domain-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                  <StringField
                    name={`${basePath}.source.group.address-group`}
                    label="address-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                </SimpleGrid>
              )}
            </Box>
          </>
        )}
      </Box>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">destination</Heading>
          <Switch
            isChecked={showDestination}
            onChange={(e) => onToggleDestination(e.target.checked)}
            isDisabled={!editing}
          />
        </Flex>
        {showDestination && (
          <>
            <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
              <StringField name={`${basePath}.destination.address`} label="address" isDisabled={!editing} emptyIsUndefined />
              <StringField name={`${basePath}.destination.port`} label="port" isDisabled={!editing} emptyIsUndefined />
              <StringField name={`${basePath}.destination.fqdn`} label="fqdn" isDisabled={!editing} emptyIsUndefined />
            </SimpleGrid>

            <Box mt={3} w="100%">
              <Flex alignItems="center" gap={3}>
                <Heading size="xs">destination-group</Heading>
                <Switch
                  isChecked={showDestinationGroup}
                  onChange={(e) => onToggleDestinationGroup(e.target.checked)}
                  isDisabled={!editing}
                />
              </Flex>
              {showDestinationGroup && (
                <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
                  <StringField
                    name={`${basePath}.destination.group.port-group`}
                    label="port-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                  <StringField
                    name={`${basePath}.destination.group.network-group`}
                    label="network-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                  <StringField
                    name={`${basePath}.destination.group.mac-group`}
                    label="mac-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                  <StringField
                    name={`${basePath}.destination.group.domain-group`}
                    label="domain-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                  <StringField
                    name={`${basePath}.destination.group.address-group`}
                    label="address-group"
                    isDisabled={!editing}
                    emptyIsUndefined
                  />
                </SimpleGrid>
              )}
            </Box>
          </>
        )}
      </Box>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">
            translation <Box as="span" color="red.300">*</Box>
          </Heading>
          <Switch
            isChecked={showTranslation}
            onChange={(e) => onToggleTranslation(e.target.checked)}
            isDisabled={!editing}
          />
        </Flex>
        {showTranslation && (
          <>
            <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
              <StringField
                name={`${basePath}.translation.address`}
                label="address"
                isDisabled={!editing}
                isRequired
                emptyIsUndefined
              />
              {mode === 'dnat' ? (
                <StringField name={`${basePath}.translation.port`} label="port" isDisabled={!editing} emptyIsUndefined />
              ) : (
                <NumberField
                  name={`${basePath}.translation.port`}
                  label="port"
                  isDisabled={!editing}
                  min={1}
                  max={65535}
                  acceptEmptyValue
                />
              )}
            </SimpleGrid>

            {mode === 'dnat' && (
              <Box mt={3} w="100%">
                <Flex alignItems="center" gap={3}>
                  <Heading size="xs">redirect</Heading>
                  <Switch
                    isChecked={showTranslationRedirect}
                    onChange={(e) => onToggleTranslationRedirect(e.target.checked)}
                    isDisabled={!editing}
                  />
                </Flex>
                {showTranslationRedirect && (
                  <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
                    <StringField
                      name={`${basePath}.translation.redirect.port`}
                      label="port"
                      isDisabled={!editing}
                      emptyIsUndefined
                    />
                  </SimpleGrid>
                )}
              </Box>
            )}

            <Box mt={3} w="100%">
              <Flex alignItems="center" gap={3}>
                <Heading size="xs">options</Heading>
                <Switch
                  isChecked={showTranslationOptions}
                  onChange={(e) => onToggleTranslationOptions(e.target.checked)}
                  isDisabled={!editing}
                />
              </Flex>
              {showTranslationOptions && (
                <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
                  <SelectField
                    name={`${basePath}.translation.options.port-mapping`}
                    label="port-mapping"
                    isDisabled={!editing}
                    options={[
                      { value: 'none', label: 'none' },
                      { value: 'random', label: 'random' },
                    ]}
                  />
                  <SelectField
                    name={`${basePath}.translation.options.address-mapping`}
                    label="address-mapping"
                    isDisabled={!editing}
                    options={[
                      { value: 'random', label: 'random' },
                      { value: 'none', label: 'none' },
                    ]}
                  />
                </SimpleGrid>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

SingleRule.propTypes = propTypes;

export default React.memo(SingleRule);
