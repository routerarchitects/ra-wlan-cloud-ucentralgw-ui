import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

type Props = {
  editing: boolean;
};

const Health = ({ editing }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.health')}
        </Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <NumberField
            name="configuration.health.interval"
            label="interval"
            definitionKey="metrics.health.interval"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <ToggleField
            name="configuration.health.dhcp-local"
            label="dhcp-local"
            isRequired
            defaultValue
            isDisabled={!editing}
          />
          <ToggleField name="configuration.health.dhcp-remote" label="dhcp-remote" isRequired isDisabled={!editing} />
          <ToggleField
            name="configuration.health.dns-local"
            label="dns-local"
            isRequired
            defaultValue
            isDisabled={!editing}
          />
          <ToggleField
            name="configuration.health.dns-remote"
            label="dns-remote"
            isRequired
            defaultValue
            isDisabled={!editing}
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default React.memo(Health);
