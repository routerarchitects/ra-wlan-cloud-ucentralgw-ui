import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const AirtimePolicies = ({ editing }) => (
  <Card variant="widget" mb={3}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Airtime Policies
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <CreatableSelectField
          editing={editing}
          name="configuration.airtime-policies.dns-match"
          label="dns-match"
          definitionKey="service.airtime-policies.dns-match"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.airtime-policies.dns-weight"
          label="dns-weight"
          definitionKey="service.airtime-policies.dns-weight"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

AirtimePolicies.propTypes = propTypes;
export default React.memo(AirtimePolicies);
