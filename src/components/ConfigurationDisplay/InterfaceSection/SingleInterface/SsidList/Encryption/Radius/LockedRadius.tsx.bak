import React, { useMemo } from 'react';
import { FormControl, FormLabel, SimpleGrid, Switch, useToast } from '@chakra-ui/react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Local from './Local';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import { useGetResource } from 'hooks/Network/Resources';

const propTypes = {
  variableBlockId: PropTypes.string.isRequired,
};

const LockedRadius = ({ variableBlockId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: resource } = useGetResource({
    t,
    toast,
    id: variableBlockId,
    enabled: true,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  if (!data) return null;

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <DisplayStringField label="authentication.host" value={data.authentication.host} isRequired />
        <DisplayNumberField label="authentication.port" value={data.authentication.port} isRequired />
        <DisplayStringField label="authentication.secret" value={data.authentication.secret} isRequired hideButton />
        <DisplayToggleField value={data.authentication['mac-filter']} label="authentication.mac-filter" />
      </SimpleGrid>
      <FormControl isDisabled>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable Accounting
        </FormLabel>
        <Switch
          isChecked={data.accounting}
          borderRadius="15px"
          size="lg"
          isDisabled
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </FormControl>
      {data.accounting && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <DisplayStringField label="accounting.host" value={data.accounting?.host} isRequired />
          <DisplayNumberField label="accounting.port" value={data.accounting?.port} isRequired />
          <DisplayStringField label="accounting.secret" value={data.accounting?.secret} isRequired hideButton />
        </SimpleGrid>
      )}
      <FormControl isDisabled>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable Dynamic Authorization
        </FormLabel>
        <Switch
          isChecked={data['dynamic-authorization']}
          borderRadius="15px"
          size="lg"
          isDisabled
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </FormControl>
      {data['dynamic-authorization'] && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={4}>
          <DisplayStringField
            label="dynamic-authorization.host"
            value={data['dynamic-authorization']?.host}
            isRequired
          />
          <DisplayNumberField
            label="dynamic-authorization.port"
            value={data['dynamic-authorization']?.port}
            isRequired
          />
          <DisplayStringField
            label="dynamic-authorization.secret"
            value={data['dynamic-authorization']?.secret}
            isRequired
            hideButton
          />
        </SimpleGrid>
      )}
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <DisplayStringField label="nas-identifier" value={data['nas-identifier']} />
        <FormControl isDisabled>
          <FormLabel ms="4px" fontSize="md" fontWeight="normal">
            chargeable-user-id
          </FormLabel>
          <Switch
            isChecked={data['chargeable-user-id']}
            borderRadius="15px"
            size="lg"
            isDisabled
            _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          />
        </FormControl>
      </SimpleGrid>
      <Formik initialValues={data}>
        <Local editing={false} namePrefix="local" />
      </Formik>
    </>
  );
};

LockedRadius.propTypes = propTypes;
export default React.memo(LockedRadius);
