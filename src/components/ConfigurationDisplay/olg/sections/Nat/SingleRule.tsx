import React, { useEffect, useMemo, useState } from 'react';
import { Alert, AlertDescription, AlertIcon, Box, Flex, Heading, SimpleGrid, Spacer, Switch } from '@chakra-ui/react';
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
  interfaceNameOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  hasSectionContext: PropTypes.bool,
};

const SingleRule = ({ editing, index, remove, mode, interfaceNameOptions, hasSectionContext }) => {
  const isSnat = mode === 'snat';
  const removeRule = () => remove();
  const basePath = `configuration.${mode}.rules[${index}]`;
  const interfaceKey = mode === 'dnat' ? 'in-interface' : 'out-interface';
  const { value } = useFastField({ name: basePath });
  const { setFieldValue } = useFormikContext();

  const currentInterfaceName = value?.[interfaceKey]?.name;
  const availableInterfaceOptions = useMemo(() => {
    if (!currentInterfaceName || interfaceNameOptions.some((option) => option.value === currentInterfaceName)) {
      return interfaceNameOptions;
    }
    return [{ label: currentInterfaceName, value: currentInterfaceName }, ...interfaceNameOptions];
  }, [currentInterfaceName, interfaceNameOptions]);

  const [showInterface, setShowInterface] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const hasRule = Boolean(value && typeof value === 'object');
    const hasInterface = Boolean(value?.[interfaceKey]);
    const hasTranslation = Boolean(value?.translation);

    setShowInterface(hasRule ? true : hasInterface);
    setShowSource(Boolean(value?.source?.address || value?.source?.port));
    setShowDestination(Boolean(value?.destination?.address || value?.destination?.port));
    setShowTranslation(hasRule ? true : hasTranslation);

    if (hasRule && !value?.[interfaceKey]) {
      setFieldValue(`${basePath}.${interfaceKey}`, { name: '' });
    }
    if (hasRule && !value?.translation) {
      setFieldValue(`${basePath}.translation`, { address: '' });
    }
  }, [basePath, interfaceKey, setFieldValue, value]);

  const onToggleInterface = (checked) => {
    setShowInterface(checked);
    if (!checked) setFieldValue(`${basePath}.${interfaceKey}`, undefined);
  };

  const onToggleSource = (checked) => {
    setShowSource(checked);
    if (!checked) setFieldValue(`${basePath}.source`, undefined);
  };

  const onToggleDestination = (checked) => {
    setShowDestination(checked);
    if (!checked) setFieldValue(`${basePath}.destination`, undefined);
  };

  const onToggleTranslation = (checked) => {
    setShowTranslation(checked);
    if (!checked) setFieldValue(`${basePath}.translation`, undefined);
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
          <>
            {availableInterfaceOptions.length === 0 && (
              <Alert status="warning" variant="left-accent" mt={2}>
                <AlertIcon />
                <AlertDescription>{hasSectionContext ? 'Interface objects are not created yet.' : 'Interface section context is unavailable.'}</AlertDescription>
              </Alert>
            )}
            <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
              <SelectField
                name={`${basePath}.${interfaceKey}.name`}
                label="name"
                isDisabled={!editing}
                isRequired
                options={availableInterfaceOptions}
              />
            </SimpleGrid>
          </>
        )}
      </Box>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">source</Heading>
          <Switch isChecked={showSource} onChange={(e) => onToggleSource(e.target.checked)} isDisabled={!editing} />
        </Flex>
        {showSource && (
          <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
            <StringField
              name={`${basePath}.source.address`}
              label="address"
              isDisabled={!editing}
              placeholder="Example: 192.168.1.10"
              emptyIsUndefined
            />
            <NumberField
              name={`${basePath}.source.port`}
              label="port"
              isDisabled={!editing}
              min={1}
              max={65535}
              acceptEmptyValue
            />
          </SimpleGrid>
        )}
      </Box>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">destination</Heading>
          <Switch isChecked={showDestination} onChange={(e) => onToggleDestination(e.target.checked)} isDisabled={!editing} />
        </Flex>
        {showDestination && (
          <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
            <StringField
              name={`${basePath}.destination.address`}
              label="address"
              isDisabled={!editing}
              placeholder="Example: 192.168.1.10"
              emptyIsUndefined
            />
            <NumberField
              name={`${basePath}.destination.port`}
              label="port"
              isDisabled={!editing}
              min={1}
              max={65535}
              acceptEmptyValue
            />
          </SimpleGrid>
        )}
      </Box>

      <Box mt={4} w="100%">
        <Flex alignItems="center" gap={3}>
          <Heading size="xs">
            translation <Box as="span" color="red.300">*</Box>
          </Heading>
          <Switch isChecked={showTranslation} onChange={(e) => onToggleTranslation(e.target.checked)} isDisabled={!editing} />
        </Flex>
        {showTranslation && (
          <SimpleGrid minChildWidth="300px" spacing="20px" mt={2} w="100%">
            <StringField
              name={`${basePath}.translation.address`}
              label="address"
              isDisabled={!editing}
              isRequired
              placeholder="Example: 192.168.1.10"
              emptyIsUndefined
            />
            <NumberField
              name={`${basePath}.translation.port`}
              label="port"
              isDisabled={!editing}
              min={1}
              max={65535}
              acceptEmptyValue
            />
          </SimpleGrid>
        )}
      </Box>
    </>
  );
};

SingleRule.propTypes = propTypes;
SingleRule.defaultProps = {
  interfaceNameOptions: [],
  hasSectionContext: false,
};

export default React.memo(SingleRule);
