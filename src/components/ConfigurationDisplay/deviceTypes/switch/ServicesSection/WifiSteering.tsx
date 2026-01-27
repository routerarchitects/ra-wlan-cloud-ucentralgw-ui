import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const WifiSteering = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Wifi Steering
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <SelectField
          name="configuration.wifi-steering.mode"
          label="mode"
          definitionKey="service.wifi-steering.mode"
          isDisabled={!editing}
          isRequired
          options={[
            { value: 'local', label: 'local' },
            {
              value: 'cloud',
              label: 'cloud',
            },
          ]}
        />
        <ToggleField
          name="configuration.wifi-steering.assoc-steering"
          label="assoc-steering"
          definitionKey="service.wifi-steering.assoc-steering"
          isDisabled={!editing}
          isRequired
        />
        <ToggleField
          name="configuration.wifi-steering.auto-channel"
          label="auto-channel"
          definitionKey="service.wifi-steering.auto-channel"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.wifi-steering.required-probe-snr"
          label="required-probe-snr"
          definitionKey="service.wifi-steering.required-probe-snr"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.wifi-steering.required-roam-snr"
          label="required-roam-snr"
          definitionKey="service.wifi-steering.required-roam-snr"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.wifi-steering.load-kick-threshold"
          label="load-kick-threshold"
          definitionKey="service.wifi-steering.load-kick-threshold"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

WifiSteering.propTypes = propTypes;
export default React.memo(WifiSteering);
