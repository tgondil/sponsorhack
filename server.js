const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3030;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'helloworld-hackathon-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Simple authentication middleware - we'll use a basic session approach
app.post('/api/auth/verify-token', async (req, res) => {
  const { token, email, name } = req.body;
  
  // In a real implementation, you would verify the Google ID token
  // For simplicity, we'll just accept the token and create a session
  
  try {
    // Create a user session
    req.session.user = {
      email,
      name,
      token
    };
    
    res.json({ success: true });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
});

app.get('/api/user', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ 
      isAuthenticated: true, 
      user: {
        name: req.session.user.name,
        email: req.session.user.email
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.get('/auth/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
      }
    });
  }
  res.json({ success: true });
});

// Standard email template function (fallback)
function generateEmailTemplate(sponsorName, senderName = "Hello World Team", senderPosition = "Organizer") {
  return `Dear ${sponsorName} Team,

I'm reaching out on behalf of Hello World, the Midwest's largest beginner-friendly hackathon hosted at Purdue University. We're excited about the possibility of having ${sponsorName} as a sponsor for our upcoming event, happening the weekend of September 27-29.

Hello World is designed to make tech more accessible to students of all skill levels. As a beginner-friendly hackathon, we focus on providing a supportive environment where students can gain hands-on experience and build real-world projects over the course of 36 hours.

We are specifically interested in gaining access to ${sponsorName}'s developer APIs and services that would help our participants build innovative projects:

[CUSTOMIZE: Insert specific APIs from ${sponsorName} that hackathon participants could use]
[CUSTOMIZE: Insert specific services that require credits/licenses]
[CUSTOMIZE: Insert specific developer tools useful during a hackathon]

We're seeking the following specific forms of sponsorship:
- API access or increased rate limits for the APIs mentioned above
- Credits for cloud/platform services that participants can use
- Licenses for developer tools during the hackathon
- Technical mentors familiar with these APIs and services
- A challenge focused on creative use of your developer technologies

Why this partnership benefits ${sponsorName}:
- Students building real projects with your APIs and tools
- Discovering creative new use cases for your developer products
- Getting direct feedback on API usability and documentation
- Expanding your developer community and user base
- Showcasing your technologies to 800+ motivated student developers

Our timeline:
- March–May: Outreach and planning
- June–August: Logistics and finalization
- September 27-28: Event weekend

We would love to discuss specific opportunities for ${sponsorName} to provide API access, credits, or developer tools that would enable our participants to build amazing projects. Would you be available for a call to discuss the details of these technical sponsorship opportunities?

Thank you for considering our request. We're excited about the possibility of featuring ${sponsorName}'s developer technologies at Hello World.

Best regards,
${senderName}
${senderPosition}
Purdue University

[NOTE: Before sending, research and add SPECIFIC ${sponsorName} APIs, services requiring credits, and developer tools that would be directly useful for hackathon participants]`;
}

// Generate email using Google's Generative AI
async function generateAIEmailTemplate(sponsorName, senderName, senderPosition) {
  try {
    // For Gemini models
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are writing a sponsorship request email for Hello World, the Midwest's largest beginner-friendly hackathon hosted at Purdue University. The email should be clear, professional, and precisely tailored to ${sponsorName}.

IMPORTANT: Research ${sponsorName} and identify ONLY:
1. APIs they offer that students could build with
2. Services that require credits/licenses for access
3. Developer tools that would be directly useful during a hackathon

Use this research to customize the email content. DO NOT mention products that don't fit these categories.

Use the following information to guide the structure:

1. Introduction
Briefly introduce yourself and Hello World. Mention that the event is beginner-friendly, open to students of all skill levels, and held at Purdue. The hackathon is happening the weekend of September 27th.

2. Sponsorship Opportunities - FOCUS ON APIS, CREDITS, AND DEVELOPER TOOLS
Research and identify ONLY the following from ${sponsorName}:
- APIs that hackathon participants could build with (e.g., ML APIs, payment APIs, mapping APIs)
- Cloud services or platforms that require credits for usage
- Developer tools that students would use during the hackathon
- Software licenses that would be valuable for participants

For each item, briefly explain:
- What specific projects/use cases students could build with it during the hackathon
- Why access to this would enhance participants' hackathon experience

Then, request ONLY these specific forms of sponsorship:
- API access or increased rate limits for the identified APIs
- Credits for identified cloud services or platforms
- Licenses for identified developer tools or software
- Technical mentors who are familiar with these specific APIs/services
- A challenge specifically focused on creative use of these APIs/services

3. Why Sponsor Hello World
Focus ONLY on benefits directly related to the APIs and services you identified:
- Students building real projects with ${sponsorName}'s APIs and tools
- Identifying creative use cases for your developer products
- Receiving technical feedback on API usability and documentation
- Encouraging adoption of your developer technologies
- Expanding your developer community

4. Timeline
Include key milestones, with exact dates:
- March–May: Outreach and planning
- June–August: Logistics and finalization
- September 27-29: Event weekend

5. Closing
End with a specific request for the APIs, credits, or tools you identified. Be clear about what you're asking for and why it would benefit both parties.

IMPORTANT FORMATTING REQUIREMENTS:
1. Format the email as PLAIN TEXT only - no HTML or markdown
2. Use simple formatting that will paste directly into an email client
3. Use blank lines between paragraphs
4. For bullet points, use simple dashes or asterisks
5. Sign off with: "${senderName}, ${senderPosition}"

Write a full email to ${sponsorName} based on these guidelines, focusing EXCLUSIVELY on APIs, services requiring credits, and developer tools that would be directly useful in a hackathon context. Do not include any products that don't fit these categories.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating AI email:', error);
    // Fallback to standard template if AI generation fails
    return generateEmailTemplate(sponsorName, senderName, senderPosition);
  }
}

// AI Email generation endpoint
app.post('/api/generate-ai-email', async (req, res) => {
  const { sponsorName, senderName, senderPosition } = req.body;
  
  if (!sponsorName || !senderName || !senderPosition) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const emailContent = await generateAIEmailTemplate(sponsorName, senderName, senderPosition);
    res.status(200).json({ success: true, emailContent });
  } catch (error) {
    console.error('Error in AI email generation:', error);
    res.status(500).json({ success: false, message: 'Failed to generate email with AI' });
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { sponsorName, sponsorEmail, senderName, senderPosition, emailContent, senderEmail, senderPassword } = req.body;
  
  if (!sponsorName || !sponsorEmail || !senderName || !senderPosition || !senderEmail || !senderPassword) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Create transporter with the user's provided credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword // This should be an app password for Gmail
      }
    });

    // Email content
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: sponsorEmail,
      subject: `Hello World Hackathon - Sponsorship Opportunity for ${sponsorName}`,
      text: emailContent || generateEmailTemplate(sponsorName, senderName, senderPosition)
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    // Return a more helpful error message
    let errorMessage = 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Check your email and password. For Gmail, use an App Password.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Network error. Check your internet connection.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage, 
      error: error.message,
      code: error.code
    });
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 