import React, { useMemo } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, SimpleGrid, useToast } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import LockedAdvanced from './LockedAdvanced';
import LockedEncryption from './LockedEncryption';
import LockedPasspoint from './LockedPasspoint';
import DisplayMultiSelectField from 'components/DisplayFields/DisplayMultiSelectField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import { useGetRadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import { useGetResource } from 'hooks/Network/Resources';
import useRadiusEndpointAccountModal from 'pages/SystemConfigurationPage/RadiusEndpoints/ViewDetailsModal/useEditModal';

const propTypes = {
  variableBlockId: PropTypes.string.isRequired,
};

const LockedSsid = ({ variableBlockId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const modal = useRadiusEndpointAccountModal({ hideEdit: true });
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

  const getEndpoint = useGetRadiusEndpoint({
    id: data?.radius?.__radiusEndpoint,
  });

  if (!data) return null;

  return (
    <>
      {modal.modal}
      {getEndpoint.data ? (
        <Alert status="info" mb={4} onClick={() => modal.openModal(getEndpoint.data)} cursor="pointer" w="max-content">
          <AlertIcon />
          <Box>
            <AlertTitle>Custom radius endpoint: {getEndpoint.data.name}</AlertTitle>
            <AlertDescription>
              Click <b>here</b> to view details
            </AlertDescription>
          </Box>
        </Alert>
      ) : null}
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <DisplayStringField value={data.name} label="name" definitionKey="interface.ssid.name" isRequired />
        <DisplaySelectField
          value={data['bss-mode']}
          label="bss-mode"
          definitionKey="interface.ssid.bss-mode"
          options={[
            { value: 'ap', label: 'ap' },
            { value: 'sta', label: 'sta' },
            { value: 'mesh', label: 'mesh' },
            { value: 'wds-ap', label: 'wds-ap' },
            { value: 'wds-sta', label: 'wds-sta' },
          ]}
          isRequired
        />
        <DisplayMultiSelectField
          value={data['wifi-bands']}
          label="wifi-bands"
          definitionKey="interface.ssid.wifi-bands"
          options={[
            { value: '2G', label: '2G' },
            { value: '5G', label: '5G' },
            { value: '6G', label: '6G' },
          ]}
          isRequired
        />
      </SimpleGrid>
      <LockedEncryption data={data} isUsingRadiusEndpoint={getEndpoint.data} />
      <LockedPasspoint data={data} />
      <LockedAdvanced data={data} />
    </>
  );
};

LockedSsid.propTypes = propTypes;
export default React.memo(LockedSsid);
