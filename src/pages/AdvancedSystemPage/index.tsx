import * as React from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Trash } from '@phosphor-icons/react';
import { Card } from 'components/Containers/Card';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { CardBody } from 'components/Containers/Card/CardBody';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { useSetAiAgentControl } from 'hooks/Network/AiAgentControl';
import { useNotification } from 'hooks/useNotification';
import { useSetGrafanaControl } from 'hooks/Network/Grafana';
import { useServiceControlStatus } from 'hooks/Network/ServiceControlStatus';
import { useDeleteSimulatedDevices } from 'hooks/Network/Simulations';
import { useUiFeatureFlags } from 'hooks/useUiFeatureFlags';

const AdvancedSystemPage = () => {
  const { successToast, apiErrorToast } = useNotification();
  const {
    aiAssistantEnabled,
    grafanaEnabled,
    setAiAssistantEnabled,
    setGrafanaEnabled,
  } = useUiFeatureFlags();
  const deleteSimulatedDevices = useDeleteSimulatedDevices();
  const setAiAgentControl = useSetAiAgentControl();
  const setGrafanaControl = useSetGrafanaControl();
  const { data: serviceControlStatus, isLoading: isServiceControlStatusLoading, refetch: refetchServiceControlStatus } =
    useServiceControlStatus();

  const aiAgentStatus = serviceControlStatus?.services?.['ai-agent'];
  const monitoringStatus = serviceControlStatus?.services?.monitoring;
  const aiAgentAvailable = typeof aiAgentStatus?.exists === 'boolean' ? aiAgentStatus.exists : true;
  const monitoringAvailable =
    typeof monitoringStatus?.running_count === 'number' && typeof monitoringStatus?.total_count === 'number';

  React.useEffect(() => {
    if (typeof aiAgentStatus?.running === 'boolean') setAiAssistantEnabled(aiAgentStatus.running);

    if (typeof monitoringStatus?.running_count === 'number' && typeof monitoringStatus?.total_count === 'number') {
      setGrafanaEnabled(monitoringStatus.total_count > 0 && monitoringStatus.running_count > 0);
    } else if (!isServiceControlStatusLoading) {
      // If monitoring status is unavailable, prefer a safe "disabled" UI state.
      setGrafanaEnabled(false);
    }
  }, [
    aiAgentStatus?.running,
    isServiceControlStatusLoading,
    monitoringStatus?.running_count,
    monitoringStatus?.total_count,
    setAiAssistantEnabled,
    setGrafanaEnabled,
  ]);

  const handleDeleteSimulatedDevices = async () =>
    deleteSimulatedDevices.mutateAsync(undefined, {
      onSuccess: () => {
        successToast({
          id: 'delete-simulated-devices',
          description: 'Simulated devices deleted!',
        });
      },
      onError: (e) => {
        apiErrorToast({
          id: 'delete-simulated-devices',
          e,
          fallbackMessage: 'Error deleting simulated devices',
        });
      },
    });

  const handleGrafanaToggle = async (enabled: boolean) => {
    setGrafanaEnabled(enabled);

    try {
      const result = await setGrafanaControl.mutateAsync({ enabled });
      await refetchServiceControlStatus();
      successToast({
        id: 'grafana-control',
        description: `Monitoring stack ${enabled ? 'enabled' : 'disabled'} (${result?.action ?? 'ok'})`,
      });
    } catch (e) {
      await refetchServiceControlStatus();
      apiErrorToast({
        id: 'grafana-control-error',
        e,
        fallbackMessage: 'Unable to change monitoring stack state',
      });
    }
  };

  const handleAiAssistantToggle = async (enabled: boolean) => {
    setAiAssistantEnabled(enabled);

    try {
      const result = await setAiAgentControl.mutateAsync({ enabled });
      await refetchServiceControlStatus();
      successToast({
        id: 'ai-agent-control',
        description: `AI agent ${enabled ? 'enabled' : 'disabled'} (${result?.action ?? 'ok'})`,
      });
    } catch (e) {
      await refetchServiceControlStatus();
      apiErrorToast({
        id: 'ai-agent-control-error',
        e,
        fallbackMessage: 'Unable to change AI agent container state',
      });
    }
  };

  const aiAssistantStatusText = !aiAgentAvailable ? 'Unavailable' : aiAssistantEnabled ? 'Enabled' : 'Disabled';

  const grafanaStatusText =
    monitoringAvailable
      ? grafanaEnabled
        ? 'Enabled'
        : 'Disabled'
      : 'Disabled';

  return (
    <VStack align="stretch" spacing={4}>
      <Card>
        <CardHeader>
          <Heading size="md">Operations</Heading>
        </CardHeader>
        <CardBody>
          <Box>
            <Heading size="sm">Delete Simulated Devices</Heading>
            <Text fontStyle="italic">Delete all simulated devices from the database. This action cannot be undone.</Text>
            <Popover>
              {({ onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button colorScheme="red" rightIcon={<Trash size={20} />}>
                      Delete
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Confirm</PopoverHeader>
                    <PopoverBody>
                      <Text>Are you sure you want to delete all simulated devices?</Text>
                      <Center mt={4}>
                        <Button onClick={onClose} mr={1}>
                          Cancel
                        </Button>
                        <DeleteButton
                          ml={1}
                          isLoading={deleteSimulatedDevices.isLoading}
                          onClick={async () => {
                            await handleDeleteSimulatedDevices();
                            onClose();
                          }}
                          isCompact={false}
                        />
                      </Center>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          </Box>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">Settings</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid minChildWidth={{ base: '100%', md: '320px' }} spacing={4}>
            <Box>
              <Heading size="sm">Enable AI Assistant</Heading>
              <Text fontSize="sm" color="gray.500">
                Show the AI assistant button in the navbar.
              </Text>
              <HStack pt={2}>
                <Text fontSize="sm">{aiAssistantStatusText}</Text>
                <Switch
                  isChecked={aiAssistantEnabled}
                  onChange={(event) => handleAiAssistantToggle(event.target.checked)}
                  isDisabled={setAiAgentControl.isLoading || isServiceControlStatusLoading}
                />
              </HStack>
            </Box>

            <Box>
              <Heading size="sm">Enable Monitoring (Grafana) Tab</Heading>
              <Text fontSize="sm" color="gray.500">
                Show the Grafana tab and start/stop monitoring containers.
              </Text>
              <HStack pt={2}>
                <Text fontSize="sm">{grafanaStatusText}</Text>
                <Switch
                  isChecked={grafanaEnabled}
                  onChange={(event) => handleGrafanaToggle(event.target.checked)}
                  isDisabled={setGrafanaControl.isLoading || isServiceControlStatusLoading}
                />
              </HStack>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default AdvancedSystemPage;
