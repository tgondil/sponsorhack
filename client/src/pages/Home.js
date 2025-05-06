import React, { useRef, useEffect } from 'react';
import { Box, Container, Heading, Text, VStack, Flex, HStack, Icon } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Simple icon components for a Notion-like feel
const AIIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SecureIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EasyIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    <Box minH="100vh" bg="white">
      <Container maxW="container.md" py={{ base: 10, md: 20 }}>
        <VStack spacing={12} align="center" textAlign="center">
          <VStack spacing={6}>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="600">
              Hello World Hackathon
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="600px">
              Automated Sponsorship Email Sender
            </Text>
          </VStack>

          <Box 
            w="100%" 
            p={8} 
            borderWidth="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            boxShadow="sm"
            bg="white"
          >
            <VStack spacing={6}>
              <Heading as="h2" fontSize="2xl" fontWeight="600">
                Connect With Sponsors Easily
              </Heading>
              <Text fontSize="md" color="gray.700" maxW="450px">
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

          <Box w="100%" pt={8}>
            <Heading as="h3" fontSize="xl" mb={6} textAlign="left">
              Features
            </Heading>
            <Flex 
              direction={{ base: 'column', md: 'row' }} 
              gap={6}
              justifyContent="space-between"
            >
              <HStack 
                p={6} 
                borderWidth="1px" 
                borderColor="gray.200" 
                borderRadius="md" 
                flex="1" 
                spacing={4} 
                align="flex-start"
              >
                <Icon as={AIIcon} boxSize={6} color="gray.800" />
                <Box>
                  <Text fontWeight="600" mb={2}>
                    AI-Powered
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Generate customized emails with Google's Gemini AI
                  </Text>
                </Box>
              </HStack>
              
              <HStack 
                p={6} 
                borderWidth="1px" 
                borderColor="gray.200" 
                borderRadius="md" 
                flex="1" 
                spacing={4} 
                align="flex-start"
              >
                <Icon as={SecureIcon} boxSize={6} color="gray.800" />
                <Box>
                  <Text fontWeight="600" mb={2}>
                    Secure
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Authentication with Google OAuth
                  </Text>
                </Box>
              </HStack>
              
              <HStack 
                p={6} 
                borderWidth="1px" 
                borderColor="gray.200" 
                borderRadius="md" 
                flex="1" 
                spacing={4} 
                align="flex-start"
              >
                <Icon as={EasyIcon} boxSize={6} color="gray.800" />
                <Box>
                  <Text fontWeight="600" mb={2}>
                    Easy to Use
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Simple interface for managing outreach
                  </Text>
                </Box>
              </HStack>
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home; 