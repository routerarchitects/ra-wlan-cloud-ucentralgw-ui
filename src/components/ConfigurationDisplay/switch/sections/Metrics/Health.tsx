import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';

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
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default React.memo(Health);
