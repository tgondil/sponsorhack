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
function defaultEmailTemplate(sponsorName, senderName = "Hello World Team", senderPosition = "Organizer") {
  return `
    Dear ${sponsorName} Team,

    My name is ${senderName}, and I am ${senderPosition.toLowerCase().trim() === "organizer" ? "an" : "the"} ${senderPosition} of the 2025 Hello World hackathon hosted at Purdue University.

    For Hello World, we are seeking sponsorship from ${sponsorName} in the following ways:

    1. Financial Support – Direct funding to help with venue, catering, and operational costs.  
    2. Tools & Services – ${sponsorName}'s tools, APIs, or platform credits that students can use during their projects.  
    3. Judging Panel – ${sponsorName} engineers or representatives to serve as judges for the final round.  
    4. Dedicated ${sponsorName} Challenge & Prize – ${sponsorName} can sponsor a custom challenge category with a unique prize. For example:  
      - Best Use of ${sponsorName} Technology – Awarded to the most innovative and impactful use of ${sponsorName}'s product or platform.

    About Hello World

    Hello World is the Midwest’s largest beginner-friendly hackathon, designed to introduce students of all levels to the world of software development and innovation. Our goal is to create an inclusive and welcoming environment where participants can collaborate, build, and learn, regardless of their technical background.

    For the first time ever, Hello World is integrated with CS 180—Purdue’s largest computer science course, required for EVERY CS MAJOR. This partnership provides sponsors with direct access to every participant, enabling hands-on engagement and unmatched visibility across Purdue’s CS community.

    We focus on:
    - Lowering Barriers to Entry: Making technology accessible to all students, regardless of experience.  
    - Bridging Theory and Practice: Encouraging hands-on learning through real-world applications.  
    - Career Advancement Opportunities: Helping students build projects, develop portfolios, and connect with industry professionals.  
    - Confidence Gain & Skill Development: Providing a space for students to experiment, learn new technologies, and grow.  
    - Community Growth & Collaboration: Strengthening Purdue’s tech community by fostering mentorship, teamwork, and innovation.

    Audience & Industry Collaboration  
    - 800+ students ranging from complete beginners to experienced programmers.  
    - Industry partnerships offering mentorship, technical challenges, and engagement opportunities.

    Tentative Timeline  
    1. March – May 2025 – Sponsorship outreach and planning  
    2. June – August 2025 – Promotion, logistics, and partnerships finalized  
    3. September 27–29 – Hackathon launch and execution

    On behalf of the Hello World team, thank you for your time and consideration. We’d love to explore how ${sponsorName} can help empower the next generation of developers through this high-impact event.

    Sincerely,  
    ${senderName}  
    ${senderPosition}, Hello World Hackathon  
    Purdue University`;
}

async function generateAIEmailTemplate(sponsorName, senderName, senderPosition) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const defaultTemplate = defaultEmailTemplate(sponsorName, senderName, senderPosition);

    let modifiedPrompt = `
      You are drafting a sponsorship outreach email for a major university hackathon. The email must sound professional, clear, and enthusiastic — not robotic. You must follow the structure and language of the template below **exactly**, but customize certain parts with accurate, company-specific references.

      Do not skip any sections. Replace placeholders where required, especially where ${sponsorName}'s tools, APIs, or services are mentioned. Use real product names, not generic placeholders. Do basic research if needed to fill in product details.

      Here is the base template (follow it strictly):

      ---

      ${defaultTemplate}

      ---

      🚨 INSTRUCTIONS:
      Use real company-specific context to customize this email.

      From ${sponsorName}, identify:
      - APIs that students could build with (e.g., AI, payments, maps)  
      - Services that require platform credits  
      - Developer tools or SDKs useful in a hackathon  
      - Software licenses that students can use temporarily  

      Then inject those details into the relevant sponsorship bullets above. Do not leave placeholders like [insert tool here] — always fill in real names and examples. Avoid products that aren't developer-facing.

      Output the final email in plain text only — no markdown, no HTML.`

    console.log(modifiedPrompt);
    const result = await model.generateContent(modifiedPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating AI email:', error);
    return defaultEmailTemplate(sponsorName, senderName, senderPosition);
  }
}

// AI Email generation endpoint
app.post('/api/generate-ai-email', async (req, res) => {
  // useAI will always have some value on frontend so no need to check for that(either true or false)
  const { sponsorName, senderName, senderPosition, useAI } = req.body;

  // no need to check for sponsorName, senderName, senderPosition validity since it's alr checked on frontend

  try {
    const emailContent = useAI ? await generateAIEmailTemplate(sponsorName, senderName, senderPosition)
                               : defaultEmailTemplate(sponsorName, senderName, senderPosition);
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
      subject: `Biggest 24 hour hackathon in the Midwest - Sponsorship Opportunity for ${sponsorName}`,
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