import React, { useMemo } from 'react';
import { Box, Flex, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { getIn, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AdvancedSettings from './AdvancedSettings';
import Encryption from './Encryption';
// import LockedSsid from './LockedSsid'; // Temporarily disabled
import PassPoint from './PassPoint';
import SsidResourcePicker from './SsidResourcePicker';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { CardBody } from 'components/Containers/Card/CardBody';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';

const propTypes = {
  index: PropTypes.number.isRequired,
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
};

const SingleSsid = ({ editing, index, namePrefix, remove }) => {
  const { t } = useTranslation();
  const removeSsid = () => remove(index);
  const { values } = useFormikContext();

  const isUsingCustomRadius = useMemo(() => {
    const v = getIn(values, `${namePrefix}`);
    return v !== undefined && v.__variableBlock === undefined;
  }, [getIn(values, `${namePrefix}`)]);
  const isPasspoint = useMemo(() => {
    const v = getIn(values, `${namePrefix}`);
    return v !== undefined && v['pass-point'] !== undefined;
  }, [getIn(values, `${namePrefix}`)]);

  return (
    <>
      <Flex px={4} py={2}>
        <Heading size="md" mr={2} pt={2}>
          #{index}
        </Heading>
        <SsidResourcePicker name={namePrefix} isDisabled={!editing} />
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeSsid} label={t('configurations.delete_ssid')} />
      </Flex>
      <CardBody display="unset">
        <Box>
          {isUsingCustomRadius ? (
            <>
              <SimpleGrid minChildWidth="300px" spacing="20px" mt={2}>
                <StringField
                  name={`${namePrefix}.name`}
                  label="SSID"
                  definitionKey="interface.ssid.name"
                  isDisabled={!editing}
                  isRequired
                />
                <SelectField
                  name={`${namePrefix}.bss-mode`}
                  label="bss-mode"
                  definitionKey="interface.ssid.bss-mode"
                  isDisabled={!editing}
                  options={[
                    { value: 'ap', label: 'ap' },
                    { value: 'sta', label: 'sta' },
                    { value: 'mesh', label: 'mesh' },
                    { value: 'wds-ap', label: 'wds-ap' },
                    { value: 'wds-sta', label: 'wds-sta' },
                  ]}
                  isRequired
                />
                <MultiSelectField
                  name={`${namePrefix}.wifi-bands`}
                  label="wifi-bands"
                  definitionKey="interface.ssid.wifi-bands"
                  isDisabled={!editing}
                  options={[
                    { value: '2G', label: '2G' },
                    { value: '5G', label: '5G' },
                    { value: '5G-lower', label: '5G-lower' },
                    { value: '5G-upper', label: '5G-upper' },
                    { value: '6G', label: '6G' },
                  ]}
                  isRequired
                />
              </SimpleGrid>
              <Encryption
                editing={editing}
                ssidName={namePrefix}
                namePrefix={`${namePrefix}.encryption`}
                radiusPrefix={`${namePrefix}.radius`}
                isPasspoint={isPasspoint}
              />
              <Box my={2}>
                <PassPoint
                  isDisabled={!editing}
                  namePrefix={`${namePrefix}.pass-point`}
                  radiusPrefix={`${namePrefix}.radius`}
                />
              </Box>
              <AdvancedSettings editing={editing} namePrefix={namePrefix} />
            </>
          ) : (
            <div style={{ padding: "10px", background: "#FFF3CD", borderRadius: "4px" }}><small>Variable block SSID - editing temporarily unavailable</small></div>
          )}
        </Box>
      </CardBody>
    </>
  );
};

SingleSsid.propTypes = propTypes;
export default React.memo(SingleSsid);
