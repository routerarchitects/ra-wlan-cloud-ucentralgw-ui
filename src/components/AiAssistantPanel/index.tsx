import React from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  HStack,
  Icon,
  Select,
  Spinner,
  Textarea,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { ChatTeardropDots } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';
import { AiChatMessage, useAiAssistantChat } from 'hooks/Network/AiAssistant';
import { useNotification } from 'hooks/useNotification';

type LocalChatMessage = AiChatMessage & { id: string; isTyping?: boolean };

export type AiAssistantPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  activeRoute?: string;
};

const INITIAL_MESSAGE: LocalChatMessage = {
  id: 'assistant-initial',
  role: 'assistant',
  content: 'Hi, I can help you understand this UI and troubleshoot OWGW workflows.',
};

const quickPrompts = [
  'Summarize this page',
  'How do I troubleshoot an offline device?',
  'Explain the current section',
];

const makeMessage = (role: AiChatMessage['role'], content: string, isTyping = false): LocalChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  isTyping,
});

const normalizeAssistantText = (text: string) =>
  String(text ?? '')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');

const AiAssistantPanel = ({ isOpen, onClose, activeRoute }: AiAssistantPanelProps) => {
  const { pathname } = useLocation();
  const { apiErrorToast, errorToast } = useNotification();
  const chatMutation = useAiAssistantChat();
  const [messages, setMessages] = React.useState<LocalChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = React.useState('');
  const [modelProvider, setModelProvider] = React.useState<'openai' | 'gemini'>('openai');
  const typingTimersRef = React.useRef<number[]>([]);
  const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const panelBg = useColorModeValue('#F8FAFF', '#141A27');
  const panelCard = useColorModeValue('rgba(255, 255, 255, 0.76)', 'rgba(23, 31, 48, 0.75)');
  const panelBorder = useColorModeValue('rgba(95, 125, 255, 0.25)', 'rgba(123, 148, 255, 0.25)');
  const assistantBubble = useColorModeValue('rgba(255, 255, 255, 0.86)', 'rgba(24, 33, 52, 0.86)');
  const assistantText = useColorModeValue('#1A202C', '#E6ECFF');
  const quickPromptBg = useColorModeValue('rgba(255, 255, 255, 0.82)', 'rgba(21, 31, 48, 0.88)');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  const isSending = chatMutation.isLoading;

  React.useEffect(
    () => () => {
      typingTimersRef.current.forEach((timerId) => window.clearInterval(timerId));
      typingTimersRef.current = [];
    },
    [],
  );

  React.useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  React.useEffect(() => {
    if (!isOpen) return;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen]);

  const animateAssistantReply = (fullText: string) => {
    const typingMessage = makeMessage('assistant', '', true);
    const chars = [...fullText];
    const step = Math.max(1, Math.ceil(chars.length / 120));
    let index = 0;

    setMessages((prev) => [...prev, typingMessage]);

    const timerId = window.setInterval(() => {
      index = Math.min(chars.length, index + step);
      const nextText = chars.slice(0, index).join('');

      setMessages((prev) =>
        prev.map((entry) =>
          entry.id === typingMessage.id
            ? {
                ...entry,
                content: nextText,
                isTyping: index < chars.length,
              }
            : entry,
        ),
      );

      if (index >= chars.length) {
        window.clearInterval(timerId);
        typingTimersRef.current = typingTimersRef.current.filter((id) => id !== timerId);
      }
    }, 20);

    typingTimersRef.current.push(timerId);
  };

  const submitMessage = (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isSending) return;

    const userMessage = makeMessage('user', message);
    let conversation: AiChatMessage[] = [];
    setMessages((prev) => {
      const nextMessages = [...prev, userMessage];
      conversation = nextMessages.map((entry) => ({ role: entry.role, content: entry.content }));
      return nextMessages;
    });
    setInputValue('');
    window.requestAnimationFrame(() => inputRef.current?.focus());

    chatMutation.mutate(
      {
        message,
        provider: modelProvider,
        conversation,
        context: {
          route: pathname,
          title: activeRoute,
        },
      },
      {
        onSuccess: (data) => {
          if (!data.reply) {
            errorToast({ description: 'AI assistant returned an empty response.' });
            return;
          }
          animateAssistantReply(normalizeAssistantText(data.reply));
        },
        onError: (e) => {
          apiErrorToast({ e, fallbackMessage: 'Unable to get response from AI assistant.' });
        },
      },
    );
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent
        bg={panelBg}
        sx={{
          backgroundImage:
            'radial-gradient(circle at 18% 12%, rgba(0, 194, 255, 0.26), transparent 42%), radial-gradient(circle at 82% 22%, rgba(255, 78, 205, 0.24), transparent 38%)',
        }}
      >
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor={panelBorder} backdropFilter="blur(8px)">
          <HStack spacing={3} pr={8} alignItems="center">
            <Flex
              w="34px"
              h="34px"
              borderRadius="12px"
              alignItems="center"
              justifyContent="center"
              bgGradient="linear(to-br, #00C2FF, #FF4ECD)"
              color="white"
              boxShadow="0 10px 24px rgba(255, 78, 205, 0.3)"
            >
              <Icon as={ChatTeardropDots} boxSize={5} />
            </Flex>
            <Box>
              <Text fontWeight="semibold" letterSpacing="0.2px">
                AI Assistant
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          <Flex h="100%" direction="column">
            <VStack
              ref={messagesContainerRef}
              align="stretch"
              spacing={3}
              p={4}
              flex={1}
              overflowY="auto"
              sx={{ overflowAnchor: 'none' }}
            >
              {messages.map((message) => (
                <Flex key={message.id} justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                  <Box
                    maxW="92%"
                    px={3.5}
                    py={2.5}
                    borderRadius="14px"
                    borderWidth="1px"
                    borderColor={message.role === 'user' ? 'transparent' : panelBorder}
                    bg={
                      message.role === 'user'
                        ? 'linear-gradient(135deg, #00B7FF 0%, #3A86FF 45%, #D94DFF 100%)'
                        : assistantBubble
                    }
                    color={message.role === 'user' ? 'white' : assistantText}
                    boxShadow={
                      message.role === 'user'
                        ? '0 10px 22px rgba(80, 85, 255, 0.32)'
                        : '0 8px 18px rgba(40, 56, 95, 0.12)'
                    }
                    backdropFilter="blur(10px)"
                  >
                    <Text fontSize="xs" mb={1} opacity={0.9}>
                      {message.role === 'user' ? 'You' : 'AI'}
                    </Text>
                    <Text fontSize="13px" whiteSpace="pre-wrap" lineHeight="1.45">
                      {/*
                        Keep long tokens (URLs, JSON, IDs) visible in narrow chat bubbles.
                      */}
                      <Box as="span" wordBreak="break-word" overflowWrap="anywhere">
                      {message.content}
                      {message.role === 'assistant' && message.isTyping ? '▍' : ''}
                      </Box>
                    </Text>
                  </Box>
                </Flex>
              ))}
              {isSending && (
                <HStack spacing={2} color={subtleText} px={2}>
                  <Spinner size="sm" color="cyan.400" />
                  <Text fontSize="sm">Thinking...</Text>
                </HStack>
              )}
            </VStack>

            <Box px={4} pb={3}>
              <HStack spacing={2} mb={3} flexWrap="wrap">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    size="xs"
                    borderRadius="full"
                    variant="outline"
                    borderColor={panelBorder}
                    bg={quickPromptBg}
                    onClick={() => submitMessage(prompt)}
                    isDisabled={isSending}
                    _hover={{
                      transform: 'translateY(-1px)',
                      borderColor: 'rgba(0,194,255,0.65)',
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </HStack>
              <FormControl>
                <HStack
                  p={2}
                  alignItems="flex-end"
                  spacing={2}
                  borderRadius="16px"
                  bg={panelCard}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  boxShadow="0 10px 24px rgba(55, 84, 156, 0.14)"
                  backdropFilter="blur(12px)"
                >
                  <Select
                    size="sm"
                    fontSize="12px"
                    maxW="118px"
                    minW="118px"
                    value={modelProvider}
                    onChange={(e) => setModelProvider(e.target.value as 'openai' | 'gemini')}
                    borderRadius="10px"
                    borderColor={panelBorder}
                    bg={quickPromptBg}
                    _focusVisible={{
                      boxShadow: '0 0 0 2px rgba(0,194,255,0.45)',
                    }}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                  </Select>
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    placeholder="Ask about this page..."
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submitMessage(inputValue);
                      }
                    }}
                    isDisabled={isSending}
                    resize="none"
                    flex={1}
                    minH="42px"
                    maxH="128px"
                    overflowY="auto"
                    borderRadius="12px"
                    border="none"
                    rows={1}
                    fontSize="13px"
                    lineHeight="1.35"
                    _placeholder={{ fontSize: '13px' }}
                    _focusVisible={{
                      boxShadow: '0 0 0 2px rgba(0,194,255,0.45)',
                    }}
                  />
                  <Button
                    alignSelf="flex-end"
                    minW="84px"
                    h="42px"
                    size="sm"
                    fontSize="12px"
                    leftIcon={<ChatIcon />}
                    borderRadius="10px"
                    onClick={() => submitMessage(inputValue)}
                    isLoading={isSending}
                    bgGradient="linear(to-r, #00C2FF, #AA48FF)"
                    color="white"
                    _hover={{
                      opacity: 0.94,
                    }}
                  >
                    Send
                  </Button>
                </HStack>
              </FormControl>
            </Box>
          </Flex>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderColor={panelBorder} justifyContent="space-between">
          <Text fontSize="xs" color={subtleText}>
            Route context: {pathname}
          </Text>
          <Button
            size="sm"
            borderRadius="full"
            variant="ghost"
            colorScheme="pink"
            onClick={() => setMessages([INITIAL_MESSAGE])}
          >
            Clear chat
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AiAssistantPanel;
