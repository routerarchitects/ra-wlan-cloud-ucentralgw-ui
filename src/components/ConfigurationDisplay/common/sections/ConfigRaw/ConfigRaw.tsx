import React from 'react';
import { Box, FormControl, FormErrorMessage, Textarea } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { useFastField } from 'hooks/useFastField';

type Props = {
  editing: boolean;
  onDelete: () => void;
};

const propTypes = {
  editing: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ConfigRaw = ({ editing, onDelete }: Props) => {
  const { value, onChange, isError } = useFastField<string>({ name: 'configurationText' });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <Card variant="widget">
      <CardBody>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <DeleteButton onClick={onDelete} isDisabled={!editing} />
        </Box>
        <FormControl isInvalid={isError} isRequired isDisabled={!editing}>
          <Textarea
            value={value ?? ''}
            onChange={handleChange}
            borderRadius="15px"
            fontSize="sm"
            h="360px"
            type="text"
            _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          />
          <FormErrorMessage>Invalid config-raw JSON. Please confirm that your value is a valid JSON array.</FormErrorMessage>
        </FormControl>
      </CardBody>
    </Card>
  );
};

ConfigRaw.propTypes = propTypes;
export default React.memo(ConfigRaw);
