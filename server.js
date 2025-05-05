const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { sponsorName, sponsorEmail, senderEmail, senderPassword } = req.body;
  
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
      text: generateEmailTemplate(sponsorName)
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