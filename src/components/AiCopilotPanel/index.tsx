import React from 'react';
import { Box, HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { ChatCircleDots, X } from '@phosphor-icons/react';

const AiCopilotPanel = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const launcherBg = useColorModeValue('blue.500', 'blue.300');

  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const aiAgentUrl = window?._env_?.REACT_APP_AI_AGENT_URL ?? 'https://ai-client.openwifi.local:9001';

  return (
    <Box position="fixed" right={{ base: '12px', md: '16px' }} bottom={{ base: '12px', md: '16px' }} zIndex={1300}>
      {isOpen ? (
        <Box
          w={{ base: 'calc(100vw - 24px)', md: '360px' }}
          h={{ base: '70vh', md: '78vh' }}
          maxH="760px"
          borderRadius="12px"
          border="1px solid"
          borderColor={borderColor}
          bg={panelBg}
          boxShadow="2xl"
          overflow="hidden"
        >
          <HStack justifyContent="space-between" px={3} py={2} borderBottom="1px solid" borderColor={borderColor}>
            <Text fontSize="sm" fontWeight="bold">
              Talk to AI
            </Text>
            <IconButton
              aria-label="Close AI panel"
              icon={<X size={16} />}
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            />
          </HStack>
          <Box h="calc(100% - 42px)">
            <iframe title="AI Copilot" src={aiAgentUrl} style={{ width: '100%', height: '100%', border: '0' }} />
          </Box>
        </Box>
      ) : null}

      <IconButton
        aria-label={isOpen ? 'Minimize AI panel' : 'Open AI panel'}
        icon={<ChatCircleDots size={22} weight="duotone" />}
        borderRadius="full"
        size="lg"
        bg={launcherBg}
        color="white"
        _hover={{ opacity: 0.9 }}
        mt={isOpen ? 3 : 0}
        ml="auto"
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </Box>
  );
};

export default AiCopilotPanel;
