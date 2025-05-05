import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Textarea,
  CloseButton,
  HStack,
  Switch,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const EmailForm = () => {
  const { user } = useAuth();
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [useAI, setUseAI] = useState(true);
  
  const toast = useToast();

  const generateEmailTemplate = (name) => {
    return `Dear ${name} Team,

I'm reaching out on behalf of Hello World, the Midwest's largest beginner-friendly hackathon hosted at Purdue University. We're excited about the possibility of having ${name} as a sponsor for our upcoming event.

Hello World is designed to make tech more accessible to students of all skill levels. As a beginner-friendly hackathon, we focus on providing a supportive environment where students can gain hands-on experience and build real-world projects.

We're seeking various forms of sponsorship:
• Financial support for venue, food, and event logistics
• Cloud computing credits or platform access
• APIs, dev tools, or software licenses
• Company representatives to serve as mentors or judges
• A company-sponsored challenge with prizes for "Best Use of ${name} Technology"

Why sponsor Hello World?
• Connect with 800+ talented students from a top-tier university
• Support tech education and inclusion initiatives
• Increase brand visibility among emerging tech talent
• Promote your technologies to the next generation of developers
• Foster innovation and community building

Our timeline:
• March–May: Outreach and planning
• June–August: Logistics and finalization
• September: Event launch (exact date TBD)

We would love to discuss how ${name} can participate in making Hello World a success. Would you be available for a brief call to explore partnership opportunities?

Thank you for considering our request. We look forward to the possibility of collaborating with ${name}.

Best regards,
${user?.name || 'Hello World Hackathon Team'}
Purdue University`;
  };

  const generateAIEmail = async () => {
    if (!sponsorName) {
      toast({
        title: 'Sponsor name required',
        description: 'Please enter a sponsor name to generate an AI email.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsGeneratingAI(true);
    
    try {
      const response = await axios.post('/api/generate-ai-email', {
        sponsorName
      }, { withCredentials: true });
      
      if (response.data.success) {
        setPreview(response.data.emailContent);
        setShowPreview(true);
      } else {
        throw new Error(response.data.message || 'Failed to generate AI email');
      }
    } catch (error) {
      toast({
        title: 'Error generating AI email',
        description: error.message || 'Something went wrong. Falling back to standard template.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Fallback to standard template
      setPreview(generateEmailTemplate(sponsorName));
      setShowPreview(true);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePreview = async () => {
    if (!sponsorName) {
      toast({
        title: 'Sponsor name required',
        description: 'Please enter a sponsor name to preview the email.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    if (useAI) {
      await generateAIEmail();
    } else {
      setPreview(generateEmailTemplate(sponsorName));
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sponsorName || !sponsorEmail) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    if (!preview) {
      toast({
        title: 'No email content',
        description: 'Please generate or preview an email first.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/send-email', {
        sponsorName,
        sponsorEmail,
        emailContent: preview
      }, { withCredentials: true });
      
      if (response.data.success) {
        toast({
          title: 'Email sent successfully',
          description: `Sponsorship email has been sent to ${sponsorEmail}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form
        setSponsorName('');
        setSponsorEmail('');
        setShowPreview(false);
        setPreview('');
      } else {
        throw new Error(response.data.message || 'Failed to send email');
      }
    } catch (error) {
      toast({
        title: 'Error sending email',
        description: error.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Send Sponsorship Email
          </Heading>
          <Text color="gray.600" mb={6}>
            Generate and send professional sponsorship request emails
          </Text>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Sponsor Name</FormLabel>
                <Input 
                  placeholder="e.g. Google, Microsoft, Meta" 
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Sponsor Email</FormLabel>
                <Input 
                  type="email" 
                  placeholder="sponsor@company.com" 
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" my={2}>
                <FormLabel mb="0">
                  Use AI to generate email (powered by Gemini)
                </FormLabel>
                <Switch 
                  colorScheme="purple" 
                  isChecked={useAI} 
                  onChange={() => setUseAI(!useAI)}
                />
              </FormControl>
              
              {user && (
                <Box bg="blue.50" p={3} borderRadius="md">
                  <Text fontSize="sm">
                    You are signed in as <strong>{user.email}</strong>. Your emails will be sent from this address.
                  </Text>
                </Box>
              )}
              
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button 
                  colorScheme="blue" 
                  variant="outline" 
                  onClick={handlePreview}
                  isLoading={isGeneratingAI}
                  loadingText="Generating"
                >
                  {useAI ? "Generate AI Email" : "Preview Email"}
                </Button>
                <Button 
                  colorScheme="purple" 
                  type="submit" 
                  isLoading={isLoading}
                  isDisabled={!preview}
                >
                  Send Email
                </Button>
              </Box>
            </VStack>
          </form>
        </Box>
        
        {showPreview && (
          <Box 
            p={6} 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg="gray.50"
            position="relative"
          >
            <Heading as="h3" size="md" mb={4}>
              {useAI ? "AI-Generated Email Preview" : "Email Preview"}
            </Heading>
            <CloseButton 
              position="absolute" 
              right="8px" 
              top="8px" 
              onClick={() => setShowPreview(false)} 
            />
            <Textarea
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              height="400px"
              fontFamily="mono"
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default EmailForm; 