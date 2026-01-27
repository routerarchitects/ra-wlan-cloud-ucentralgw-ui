import React from 'react';
import { FormControl, FormErrorMessage, FormLabel, Heading, Textarea } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { useFastField } from 'hooks/useFastField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const ThirdParty = ({ editing }) => {
  const { t } = useTranslation();
  const { value, onChange, isError } = useFastField({ name: 'configuration' });

  const handleChange = React.useCallback((e) => {
    onChange(e.target.value);
  }, []);

  return (
    <Card variant="widget">
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.third_party')}
        </Heading>
      </CardHeader>
      <CardBody>
        <FormControl isInvalid={isError} isRequired isDisabled={!editing}>
          <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
            {t('configurations.third_party_instructions')}
          </FormLabel>
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={handleChange}
            borderRadius="15px"
            fontSize="sm"
            h="360px"
            type="text"
            _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          />
          <FormErrorMessage>{t('form.invalid_third_party')}</FormErrorMessage>
        </FormControl>
      </CardBody>
    </Card>
  );
};

ThirdParty.propTypes = propTypes;
export default React.memo(ThirdParty);
