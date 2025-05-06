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
  Textarea,
  CloseButton,
  HStack,
  Switch,
  Grid,
  GridItem,
  Divider,
  Link,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const EmailForm = () => {
  const { user } = useAuth();
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [senderPosition, setSenderPosition] = useState('Organizer');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPassword, setSenderPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [useAI, setUseAI] = useState(true);
  
  const toast = useToast();

  // Update sender name when user changes
  React.useEffect(() => {
    if (user?.name) {
      setSenderName(user.name);
    }
    if (user?.email) {
      setSenderEmail(user.email);
    }
  }, [user]);

  const generateEmailTemplate = (name) => {
    return `Dear ${name} Team,

I'm reaching out on behalf of Hello World, the Midwest's largest beginner-friendly hackathon hosted at Purdue University. We're excited about the possibility of having ${name} as a sponsor for our upcoming event, happening the weekend of September 27-29.

Hello World is designed to make tech more accessible to students of all skill levels. As a beginner-friendly hackathon, we focus on providing a supportive environment where students can gain hands-on experience and build real-world projects.

We're seeking various forms of sponsorship:
- Financial support for venue, food, and event logistics
- Cloud computing credits or platform access
- APIs, dev tools, or software licenses
- Company representatives to serve as mentors or judges
- A company-sponsored challenge with prizes for "Best Use of ${name} Technology"

Why sponsor Hello World?
- Connect with 800+ talented students from a top-tier university
- Support tech education and inclusion initiatives
- Increase brand visibility among emerging tech talent
- Promote your technologies to the next generation of developers
- Foster innovation and community building

Our timeline:
- March–May: Outreach and planning
- June–August: Logistics and finalization
- September 27-29: Event weekend

We would love to discuss how ${name} can participate in making Hello World a success. Would you be available for a brief call to explore partnership opportunities?

Thank you for considering our request. We look forward to the possibility of collaborating with ${name}.

Best regards,
${senderName}
${senderPosition}
Purdue University`;
  };

  const generateAIEmail = async () => {
    if (!sponsorName || !senderName || !senderPosition) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields to generate an AI email.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsGeneratingAI(true);
    
    try {
      const response = await axios.post('/api/generate-ai-email', {
        sponsorName,
        senderName,
        senderPosition
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
    if (!sponsorName || !senderName || !senderPosition) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields to preview the email.',
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
    
    if (!sponsorName || !sponsorEmail || !senderName || !senderPosition || !senderEmail || !senderPassword) {
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
        senderName,
        senderPosition,
        senderEmail,
        senderPassword,
        emailContent: preview
      });
      
      if (response.data.success) {
        toast({
          title: 'Email sent successfully',
          description: `Sponsorship email has been sent to ${sponsorEmail}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form (but keep credentials)
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
        description: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
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
        <VStack spacing={1} align="flex-start">
          <Heading as="h2" fontSize="xl" fontWeight="600">
            Send Sponsorship Email
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Generate and send professional sponsorship request emails
          </Text>
        </VStack>
          
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <Box>
              <FormControl isRequired mb={4}>
                <FormLabel fontSize="sm" fontWeight="medium">Sponsor Name</FormLabel>
                <Input 
                  placeholder="e.g. Google, Microsoft, Meta" 
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  size="md"
                  bg="white"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium">Sponsor Email</FormLabel>
                <Input 
                  type="email" 
                  placeholder="sponsor@company.com" 
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  size="md"
                  bg="white"
                />
              </FormControl>
            </Box>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Your Name</FormLabel>
                  <Input 
                    placeholder="Your full name" 
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    size="md"
                    bg="white"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Your Position</FormLabel>
                  <Input 
                    placeholder="e.g. Organizer, Director, President" 
                    value={senderPosition}
                    onChange={(e) => setSenderPosition(e.target.value)}
                    size="md"
                    bg="white"
                  />
                </FormControl>
              </GridItem>
            </Grid>
            
            <FormControl display="flex" alignItems="center" my={2}>
              <FormLabel mb="0" fontSize="sm" fontWeight="medium">
                Use AI to generate email (powered by Gemini)
              </FormLabel>
              <Switch 
                colorScheme="gray" 
                isChecked={useAI} 
                onChange={() => setUseAI(!useAI)}
              />
            </FormControl>
            
            <Divider />
            
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={2}>
                Email Sending Credentials
              </Text>
              <Text fontSize="xs" color="gray.500" mb={4}>
                Your credentials are only used to send the email and are not stored.
              </Text>
              
              <FormControl isRequired mb={4}>
                <FormLabel fontSize="sm" fontWeight="medium">Your Gmail Address</FormLabel>
                <Input 
                  type="email" 
                  placeholder="your.email@gmail.com" 
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  size="md"
                  bg="white"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium">Gmail App Password</FormLabel>
                <Input 
                  type="password" 
                  placeholder="Your Gmail App Password" 
                  value={senderPassword}
                  onChange={(e) => setSenderPassword(e.target.value)}
                  size="md"
                  bg="white"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  For Gmail, you need to use an App Password instead of your regular password.{" "}
                  <Link 
                    href="https://support.google.com/accounts/answer/185833" 
                    color="black"
                    textDecoration="underline"
                    isExternal
                  >
                    Learn how to create one
                  </Link>
                </Text>
              </FormControl>
            </Box>
            
            <Flex justify="space-between" mt={4}>
              <Button 
                variant="outline" 
                onClick={handlePreview}
                isLoading={isGeneratingAI}
                loadingText="Generating"
                fontWeight="medium"
                size="md"
              >
                {useAI ? "Generate AI Email" : "Preview Email"}
              </Button>
              <Button 
                variant="solid" 
                type="submit" 
                isLoading={isLoading}
                isDisabled={!preview}
                fontWeight="medium"
                size="md"
              >
                Send Email
              </Button>
            </Flex>
          </VStack>
        </form>
        
        {showPreview && (
          <Box 
            mt={6}
            p={6} 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg="white"
            position="relative"
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="600" fontSize="sm">
                {useAI ? "AI-Generated Email Preview" : "Email Preview"}
              </Text>
              <HStack>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    // Copy to clipboard
                    navigator.clipboard.writeText(preview);
                    toast({
                      title: "Copied to clipboard",
                      status: "success",
                      duration: 2000,
                    });
                  }}
                >
                  Copy
                </Button>
                <CloseButton size="sm" onClick={() => setShowPreview(false)} />
              </HStack>
            </Flex>
            <Textarea
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              height="400px"
              fontFamily="mono"
              fontSize="sm"
              bg="white"
              border="none"
              p={0}
              _focus={{ 
                boxShadow: "none",
                border: "none" 
              }}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default EmailForm; 