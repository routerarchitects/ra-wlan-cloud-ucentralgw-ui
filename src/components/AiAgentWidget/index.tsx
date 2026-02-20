import React from 'react';
import { Box, HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { ChatCircleDots, X } from '@phosphor-icons/react';

const AiAgentWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelBg = useColorModeValue('white', 'gray.700');
  const panelBorder = useColorModeValue('gray.200', 'gray.600');
  const buttonBg = useColorModeValue('blue.500', 'blue.300');

  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const aiAgentUrl = window?._env_?.REACT_APP_AI_AGENT_URL ?? 'http://10.1.1.25:9001';

  return (
    <Box position="fixed" right={{ base: '16px', md: '20px' }} bottom={{ base: '16px', md: '20px' }} zIndex={1400}>
      {isOpen ? (
        <Box
          w={{ base: 'calc(100vw - 32px)', md: '420px' }}
          h={{ base: '70vh', md: '600px' }}
          bg={panelBg}
          border="1px solid"
          borderColor={panelBorder}
          borderRadius="12px"
          overflow="hidden"
          boxShadow="2xl"
        >
          <HStack justifyContent="space-between" px={3} py={2} borderBottom="1px solid" borderColor={panelBorder}>
            <HStack spacing={2}>
              <ChatCircleDots size={18} weight="duotone" />
              <Text fontSize="sm" fontWeight="bold">
                AI Agent
              </Text>
            </HStack>
            <IconButton
              aria-label="Close AI agent panel"
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              icon={<X size={16} />}
            />
          </HStack>
          <Box h="calc(100% - 45px)">
            <iframe
              title="AI Agent"
              src={aiAgentUrl}
              style={{ width: '100%', height: '100%', border: '0' }}
              allow="clipboard-read; clipboard-write"
            />
          </Box>
        </Box>
      ) : null}

      <IconButton
        aria-label="Open AI agent panel"
        mt={isOpen ? 3 : 0}
        ml="auto"
        borderRadius="full"
        size="lg"
        bg={buttonBg}
        color="white"
        _hover={{ opacity: 0.9 }}
        onClick={() => setIsOpen((v) => !v)}
        icon={<ChatCircleDots size={24} weight="duotone" />}
      />
    </Box>
  );
};

export default AiAgentWidget;
