import React from 'react';
import { FormControl, FormLabel, Heading, SimpleGrid, Switch } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { INTERFACE_BRIDGE_SCHEMA } from '../../interfacesConstants';
import BridgeSection from './BridgeSection';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

const Bridge = ({ editing, index }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const isBridgeActive = () => values.configuration[index].bridge !== undefined;

  const onBridgeToggle = (e) => {
    if (!e.target.checked) {
      setFieldValue(`configuration[${index}].bridge`, undefined);
    } else {
      setFieldValue(`configuration[${index}].bridge`, INTERFACE_BRIDGE_SCHEMA(t, true).cast());
    }
  };

  return (
    <>
      <Heading size="md">Bridge</Heading>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <FormControl isDisabled={!editing}>
          <FormLabel ms="4px" fontSize="md" fontWeight="normal">
            Bridge
          </FormLabel>
          <Switch
            onChange={onBridgeToggle}
            isChecked={isBridgeActive()}
            borderRadius="15px"
            size="lg"
            isDisabled={!editing}
          />
        </FormControl>
        <BridgeSection index={index} isEnabled={isBridgeActive()} editing={editing} />
      </SimpleGrid>
    </>
  );
};
Bridge.propTypes = propTypes;
export default React.memo(Bridge);
