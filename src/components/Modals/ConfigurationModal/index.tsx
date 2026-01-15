import * as React from 'react';
import { 
  Box,
  Flex,
  HStack, 
  LayoutProps, 
  Modal as ChakraModal, 
  ModalBody, 
  ModalContent, 
  ModalHeader,
  ModalOverlay,
  Spacer,
  useColorModeValue,
  VStack 
} from '@chakra-ui/react';
import { CloseButton } from 'components/Buttons/CloseButton';

export type ConfigurationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  topRightButtons?: React.ReactNode;
  tags?: React.ReactNode;
  options?: {
    modalSize?: 'sm' | 'md' | 'lg';
    maxWidth?: LayoutProps['maxWidth'];
  };
  children: React.ReactElement;
};

const _ConfigurationModal = ({ isOpen, onClose, title, topRightButtons, tags, options, children }: ConfigurationModalProps) => {
  const bg = useColorModeValue('blue.50', 'blue.700');
  
  const maxWidth = React.useMemo(() => {
    if (options?.maxWidth) return options.maxWidth;
    if (options?.modalSize === 'sm') return undefined;
    if (options?.modalSize === 'lg') {
      return { sm: '90%', md: '900px', lg: '1000px', xl: '80%' };
    }

    return { sm: '600px', md: '700px', lg: '800px', xl: '50%' };
  }, [options]);

  return (
    <ChakraModal onClose={onClose} isOpen={isOpen} size={options?.modalSize === 'sm' ? 'sm' : 'xl'}>
      <ModalOverlay />
      <ModalContent maxWidth={maxWidth}>
        <ModalHeader bg={bg}>
          {/* Mobile: Title and close button */}
          <Box display={{base: "block", md: "none"}}>
            {title}
          </Box>
          
          {/* Mobile: Tags */}
          {tags && (
            <HStack spacing={2} mt={2} display={{base: "flex", md: "none"}}>
              {tags}
            </HStack>
          )}
          
          {/* Mobile: Buttons */}
          <Flex wrap="wrap" gap={2} mt={2} display={{base: "flex", md: "none"}}>
            {topRightButtons}
          </Flex>
          
          {/* Mobile: Close button */}
          <Box position="absolute" top={4} right={4} display={{base: "block", md: "none"}}>
            <CloseButton onClick={onClose} />
          </Box>

          {/* Desktop: Everything in one line */}
          <Box display={{base: "none", md: "block"}}>
            {title}
          </Box>
          {tags && (
            <HStack spacing={2} ml={2} display={{base: "none", md: "flex"}}>
              {tags}
            </HStack>
          )}
          <Spacer display={{base: "none", md: "block"}} />
          <HStack spacing={2} display={{base: "none", md: "flex"}}>
            {topRightButtons}
            <CloseButton onClick={onClose} />
          </HStack>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export const ConfigurationModal = React.memo(_ConfigurationModal);
