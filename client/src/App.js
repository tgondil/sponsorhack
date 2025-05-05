import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import EmailForm from './components/EmailForm';

function App() {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" mb={4} color="purple.700">
            Hello World Hackathon
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Automated Sponsorship Email Sender
          </Text>
        </Box>
        
        <EmailForm />
      </VStack>
    </Container>
  );
}

export default App; 