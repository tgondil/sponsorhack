import React from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Button, 
  useDisclosure, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmailForm from '../components/EmailForm';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={6}>
      <HStack justifyContent="space-between" mb={6}>
        <Box>
          <Heading as="h1" size="xl" color="purple.700">
            Hello World Hackathon
          </Heading>
          <Text color="gray.600">Sponsorship Email Dashboard</Text>
        </Box>
        {user && (
          <Menu>
            <MenuButton as={Button} variant="ghost" size="md">
              <HStack>
                <Avatar size="sm" name={user.name} />
                <Text>{user.name}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
      
      <Box mb={8}>
        <Text fontSize="lg">
          Welcome back{user ? `, ${user.name}` : ''}! Ready to connect with sponsors?
        </Text>
      </Box>
      
      <Box bg="white" p={8} borderRadius="lg" shadow="md">
        <EmailForm />
      </Box>
    </Container>
  );
};

export default Dashboard; 