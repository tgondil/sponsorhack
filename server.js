const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3030;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Email template function
function generateEmailTemplate(sponsorName) {
  return `Dear ${sponsorName} Team,

I'm reaching out on behalf of Hello World, the Midwest's largest beginner-friendly hackathon hosted at Purdue University. We're excited about the possibility of having ${sponsorName} as a sponsor for our upcoming event.

Hello World is designed to make tech more accessible to students of all skill levels. As a beginner-friendly hackathon, we focus on providing a supportive environment where students can gain hands-on experience and build real-world projects.

We're seeking various forms of sponsorship:
• Financial support for venue, food, and event logistics
• Cloud computing credits or platform access
• APIs, dev tools, or software licenses
• Company representatives to serve as mentors or judges
• A company-sponsored challenge with prizes for "Best Use of ${sponsorName} Technology"

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

We would love to discuss how ${sponsorName} can participate in making Hello World a success. Would you be available for a brief call to explore partnership opportunities?

Thank you for considering our request. We look forward to the possibility of collaborating with ${sponsorName}.

Best regards,
Hello World Hackathon Team
Purdue University`;
}

// Generate email using Google's Generative AI
async function generateAIEmailTemplate(sponsorName) {
  try {
    // For Gemini models
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are writing a sponsorship request email for Hello World, the Midwest's largest beginner-friendly hackathon hosted at Purdue University. The email should be clear, professional, and tailored to ${sponsorName}.

Use the following information to guide the structure:

1. Introduction
Briefly introduce yourself and Hello World. Mention that the event is beginner-friendly, open to students of all skill levels, and held at Purdue.

2. Sponsorship Opportunities
List the kinds of support you're seeking:
- Financial support for venue, food, and logistics
- Cloud computing credits (e.g. Google Cloud, Azure, AWS)
- APIs, dev tools, or platform access (e.g. Gemini, Firebase, OpenAI, GitHub Copilot)
- Company reps to serve as judges or mentors
- A company-sponsored challenge and prize (e.g. "Best Use of [Company Tool]")

3. Why Sponsor Hello World
Emphasize the mission:
- Making tech more accessible
- Hands-on, real-world learning
- Connection to talent early in their CS journey
- Exposure to 800+ students at a top-tier university
- Community building and innovation

4. Timeline
Include key milestones:
- March–May: Outreach and planning
- June–August: Logistics and finalization
- September: Event launch (exact date TBD)

5. Closing
End with a note of appreciation and an invitation to connect or discuss further. Be warm and forward-looking.

The tone should be enthusiastic but respectful, and the email should sound like it's coming from a student organizer passionate about tech education and inclusion.

Write a full email to ${sponsorName} based on this outline.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating AI email:', error);
    // Fallback to standard template if AI generation fails
    return generateEmailTemplate(sponsorName);
  }
}

// AI Email generation endpoint
app.post('/api/generate-ai-email', async (req, res) => {
  const { sponsorName } = req.body;
  
  if (!sponsorName) {
    return res.status(400).json({ success: false, message: 'Sponsor name is required' });
  }

  try {
    const emailContent = await generateAIEmailTemplate(sponsorName);
    res.status(200).json({ success: true, emailContent });
  } catch (error) {
    console.error('Error in AI email generation:', error);
    res.status(500).json({ success: false, message: 'Failed to generate email with AI' });
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { sponsorName, sponsorEmail, senderEmail, senderPassword, emailContent } = req.body;
  
  if (!sponsorName || !sponsorEmail || !senderEmail || !senderPassword) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword
      }
    });

    // Email content
    const mailOptions = {
      from: senderEmail,
      to: sponsorEmail,
      subject: `Hello World Hackathon - Sponsorship Opportunity for ${sponsorName}`,
      text: emailContent || generateEmailTemplate(sponsorName)
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
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