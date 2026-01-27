import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_SCHEMA } from '../../interfacesConstants';
import { CreateButton } from 'components/Buttons/CreateButton';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  pushSsid: PropTypes.func.isRequired,
  setTabIndex: PropTypes.func.isRequired,
  arrLength: PropTypes.number.isRequired,
};
const CreateSsidButton = ({ editing, pushSsid, setTabIndex, arrLength }) => {
  const { t } = useTranslation();

  const createSsid = useCallback(() => {
    pushSsid(INTERFACE_SSID_SCHEMA(t, true).cast());
    setTabIndex(arrLength);
  }, [setTabIndex, arrLength]);

  if (!editing) return null;

  return (
    <CreateButton
      label={t('configurations.add_ssid')}
      onClick={createSsid}
      borderRadius={0}
      mt="auto"
      isCompact={arrLength !== 0}
      size="lg"
    />
  );
};

CreateSsidButton.propTypes = propTypes;
export default React.memo(CreateSsidButton);
