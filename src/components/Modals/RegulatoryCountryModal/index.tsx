import * as React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { Modal } from '../Modal';
import COUNTRY_LIST from 'constants/countryList';
import { useGetDeviceCapabilities } from 'hooks/Network/Devices';
import { useSetFixedCountry } from 'hooks/Network/FixedConfig';

interface Props {
  serialNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

const RegulatoryCountryModal = ({ serialNumber, isOpen, onClose, onSubmitted }: Props) => {
  const toast = useToast();
  const capabilitiesQuery = useGetDeviceCapabilities({ serialNumber });
  const setFixedCountry = useSetFixedCountry({ serialNumber });
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);

  // The existing capabilities hook types the payload as an array, but the AP
  // advertises the capabilities as a JSON object (e.g. country_codes: ['NG', 'US']).
  const rawCapabilities: unknown = capabilitiesQuery.data?.capabilities;
  const capabilities =
    rawCapabilities && typeof rawCapabilities === 'object' && !Array.isArray(rawCapabilities)
      ? (rawCapabilities as Record<string, unknown>)
      : undefined;
  const advertisedCodes = capabilities?.country_codes;
  const currentCountry = typeof capabilities?.country === 'string' ? capabilities.country : '';

  const countryCodes = React.useMemo(() => {
    if (!Array.isArray(advertisedCodes)) return [];
    return Array.from(
      new Set(
        advertisedCodes.filter(
          (value): value is string => typeof value === 'string' && /^[A-Z]{2}$/.test(value),
        ),
      ),
    );
  }, [advertisedCodes]);

  React.useEffect(() => {
    if (isOpen && !capabilitiesQuery.isLoading) {
      setSelectedCountry(countryCodes.includes(currentCountry) ? currentCountry : '');
      setConfirmed(false);
    }
  }, [isOpen, capabilitiesQuery.isLoading, countryCodes, currentCountry]);

  const countryLabel = (code: string) => COUNTRY_LIST.find((item) => item.value === code)?.label ?? code;
  const canSubmit =
    countryCodes.includes(selectedCountry) &&
    selectedCountry !== currentCountry &&
    confirmed &&
    !capabilitiesQuery.isError &&
    !capabilitiesQuery.isFetching &&
    !setFixedCountry.isLoading;

  const handleClose = () => {
    if (!setFixedCountry.isLoading) onClose();
  };

  const handleApply = () => {
    if (!canSubmit) return;

    setFixedCountry.mutate(selectedCountry, {
      onSuccess: () => {
        // fixedconfig initiates the AP's existing reset sequence. Success here
        // means the command was accepted, not that the device has reconnected.
        onSubmitted();
        toast({
          title: 'Regulatory country command sent',
          description: `The AP will reset to apply ${countryLabel(selectedCountry)}. Wait for it to reconnect before verifying its capabilities.`,
          status: 'info',
          duration: 8000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
      },
      onError: (error) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.errorText ?? error.response?.data?.ErrorDescription ?? error.message
          : error instanceof Error
          ? error.message
          : 'Unable to update regulatory country.';
        toast({
          title: 'Country change failed',
          description: message,
          status: 'error',
          duration: 8000,
          isClosable: true,
          position: 'top-right',
        });
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Set Regulatory Country" options={{ modalSize: 'sm' }}>
      <Box pb={5}>
        <Text mb={4} fontSize="sm" color="gray.500">
          Device: {serialNumber}
        </Text>

        {capabilitiesQuery.isLoading ? (
          <HStack mb={4}>
            <Spinner size="sm" />
            <Text>Loading device country options...</Text>
          </HStack>
        ) : null}

        {capabilitiesQuery.isError ? (
          <Alert status="error" mb={4}>
            <AlertIcon />
            Unable to load device capabilities. Close and reopen this dialog to retry.
          </Alert>
        ) : null}

        {!capabilitiesQuery.isLoading && !capabilitiesQuery.isError && countryCodes.length === 0 ? (
          <Alert status="warning" mb={4}>
            <AlertIcon />
            This AP does not advertise any country_codes. Country selection is unavailable.
          </Alert>
        ) : null}

        {countryCodes.length > 0 ? (
          <>
            <FormControl isRequired mb={3}>
              <FormLabel>Regulatory country</FormLabel>
              <Select
                value={selectedCountry}
                onChange={(event) => {
                  setSelectedCountry(event.target.value);
                  setConfirmed(false);
                }}
                isDisabled={setFixedCountry.isLoading || capabilitiesQuery.isFetching}
                placeholder="Select a country"
              >
                {countryCodes.map((code) => (
                  <option key={code} value={code}>
                    {countryLabel(code)} ({code})
                  </option>
                ))}
              </Select>
            </FormControl>
            <Text mb={4} fontSize="sm" color="gray.500">
              Current fixed country: {currentCountry ? `${countryLabel(currentCountry)} (${currentCountry})` : 'Unknown'}
            </Text>
            <Alert status="warning" mb={4} alignItems="flex-start">
              <AlertIcon />
              <Text fontSize="sm">
                Changing the regulatory country will factory reset and reboot the device. Network connectivity will be temporarily interrupted.
              </Text>
            </Alert>
            <Checkbox
              mb={5}
              isChecked={confirmed}
              isDisabled={setFixedCountry.isLoading}
              onChange={(event) => setConfirmed(event.target.checked)}
            >
              I understand that the device will reset and reboot.
            </Checkbox>
          </>
        ) : null}

        <HStack justifyContent="flex-end" spacing={2}>
          <Button variant="ghost" onClick={handleClose} isDisabled={setFixedCountry.isLoading}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleApply} isDisabled={!canSubmit} isLoading={setFixedCountry.isLoading}>
            Apply and Reset AP
          </Button>
        </HStack>
      </Box>
    </Modal>
  );
};

export default RegulatoryCountryModal;
