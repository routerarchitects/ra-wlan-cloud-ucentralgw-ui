import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const OnlineCheck = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Online Check
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <MultiSelectField
          name="configuration.online-check.action"
          label="action"
          definitionKey="service.online-check.action"
          isDisabled={!editing}
          isRequired
          options={[
            { value: 'wifi', label: 'wifi' },
            {
              value: 'leds',
              label: 'leds',
            },
          ]}
        />
        <CreatableSelectField
          name="configuration.online-check.ping-hosts"
          label="ping-hosts"
          definitionKey="service.online-check.ping-hosts"
          isDisabled={!editing}
          isRequired
        />
        <CreatableSelectField
          name="configuration.online-check.download-hosts"
          label="download-hosts"
          definitionKey="service.online-check.download-hosts"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.online-check.check-interval"
          label="check-interval"
          definitionKey="service.online-check.check-interval"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <NumberField
          name="configuration.online-check.check-threshold"
          label="check-threshold"
          definitionKey="service.online-check.check-threshold"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

OnlineCheck.propTypes = propTypes;
export default React.memo(OnlineCheck);
