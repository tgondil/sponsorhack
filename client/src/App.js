import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App; 