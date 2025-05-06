import React, { useEffect } from 'react';
import { Box, 
  Container, 
  Heading, 
  Text, 
  HStack, 
  Button, 
  Avatar, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Flex } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmailForm from '../components/EmailForm';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box py={4} px={6} borderBottomWidth="1px" borderColor="gray.200" bg="white">
        <Container maxW="container.md">
          <HStack justifyContent="space-between">
            <Heading as="h1" fontSize="2xl" fontWeight="600">
              Hello World Hackathon
            </Heading>
            {user && (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="md"
                  rightIcon={
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                >
                  <HStack>
                    <Avatar size="sm" name={user.name} bg="gray.200" color="gray.700" />
                    <Text fontWeight="medium">{user.name}</Text>
                  </HStack>
                </MenuButton>
                <MenuList shadow="md" borderColor="gray.200">
                  <MenuItem onClick={logout} fontWeight="medium">Sign out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.md" py={8}>
        <Box mb={8}>
          <Text fontSize="lg" color="gray.700">
            Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}! Ready to connect with sponsors?
          </Text>
        </Box>
        
        <Box bg="white" p={8} borderWidth="1px" borderColor="gray.200" borderRadius="md" shadow="sm">
          <EmailForm />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 