import React from 'react';
import PropTypes from 'prop-types';
import { NumberField } from 'components/Form/Fields/NumberField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isEnabled: PropTypes.bool.isRequired,
};

const IpV4 = ({ editing, index, isEnabled }) => {
  if (!isEnabled) return null;

  return (
    <>
      <NumberField name={`configuration[${index}].bridge.mtu`} label="bridge.mtu" isDisabled={!editing} isRequired />
      <NumberField
        name={`configuration[${index}].bridge.tx-queue-len`}
        label="bridge.tx-queue-len"
        isDisabled={!editing}
        isRequired
      />
      <ToggleField
        name={`configuration[${index}].bridge.isolate-ports`}
        label="bridge.isolate-ports"
        isDisabled={!editing}
        isRequired
      />
    </>
  );
};
IpV4.propTypes = propTypes;
export default React.memo(IpV4);
