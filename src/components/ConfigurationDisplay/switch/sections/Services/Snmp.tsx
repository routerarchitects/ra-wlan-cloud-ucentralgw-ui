import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Snmp = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        snmp
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <ToggleField
          name="configuration.snmp.enable"
          label="enable"
          definitionKey="service.snmp.enable"
          isDisabled={!editing}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Snmp.propTypes = propTypes;
export default React.memo(Snmp);
