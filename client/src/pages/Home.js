import React, { useRef, useEffect } from 'react';
import { Box, Container, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (googleButtonRef.current) {
      login(googleButtonRef);
    }
  }, [login]);

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={10} align="center" textAlign="center">
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="purple.700">
            Hello World Hackathon
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="700px">
            Automated Sponsorship Email Sender
          </Text>
        </Box>

        <Box bg="gray.50" p={8} borderRadius="lg" shadow="md" maxW="700px" w="100%">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Connect With Sponsors Easily
            </Heading>
            <Text fontSize="lg">
              Generate and send professional sponsorship request emails to potential sponsors for the 
              Hello World Hackathon, the Midwest's largest beginner-friendly hackathon held at Purdue University.
            </Text>
            <Box py={4}>
              <div ref={googleButtonRef}></div>
            </Box>
            <Text fontSize="sm" color="gray.500">
              Sign in to generate, preview, and send emails securely
            </Text>
          </VStack>
        </Box>

        <Box maxW="700px">
          <Heading as="h3" size="md" mb={4}>
            Features
          </Heading>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            <Box p={4} bg="blue.50" borderRadius="md" flex="1">
              <Heading as="h4" size="sm" mb={2}>
                AI-Powered
              </Heading>
              <Text>
                Generate customized emails with Google's Gemini AI
              </Text>
            </Box>
            <Box p={4} bg="green.50" borderRadius="md" flex="1">
              <Heading as="h4" size="sm" mb={2}>
                Secure
              </Heading>
              <Text>
                Authentication with Google OAuth
              </Text>
            </Box>
            <Box p={4} bg="purple.50" borderRadius="md" flex="1">
              <Heading as="h4" size="sm" mb={2}>
                Easy to Use
              </Heading>
              <Text>
                Simple interface for managing outreach
              </Text>
            </Box>
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home; 