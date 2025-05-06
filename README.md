# Hello World Hackathon - Sponsorship Email Sender

A full-stack web application that automates sending personalized, AI-generated sponsorship request emails for Hello World Hackathon at Purdue University. The application focuses on requesting APIs, credits, and developer tools relevant for hackathon participants.

## Features

- **AI-Powered Email Generation**: Uses Google's Gemini AI to create highly customized sponsorship emails
- **Company-Specific Content**: Automatically researches and includes relevant APIs and developer tools from each company
- **Gmail Integration**: Send emails directly through your Gmail account
- **Customizable Templates**: Edit generated content before sending
- **Copy to Clipboard**: Easily copy email content for sending through other clients

## Tech Stack

- **Frontend**: React, Chakra UI
- **Backend**: Node.js, Express
- **AI**: Google Generative AI (Gemini)
- **Email Service**: Nodemailer

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm
- Google API Key for Gemini AI
- Gmail account (for sending emails)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd sponsorhack
   ```

2. Install server dependencies
   ```
   npm install
   ```

3. Install client dependencies
   ```
   npm run install-client
   ```

### Environment Configuration

1. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3030
   NODE_ENV=development
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

2. Get a Google API Key for Gemini:
   - Go to [Google AI Studio](https://makersuite.google.com/)
   - Create an API key for the Gemini API
   - Copy the key to your `.env` file

### Gmail App Password Setup

To send emails directly through the application, you'll need to set up an App Password for your Gmail account:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security" from the left navigation
3. Under "Signing in to Google," select "2-Step Verification" and enable it if not already enabled
4. Once enabled, scroll to the bottom of the "2-Step Verification" page to the "App Passwords" section and click the right arrow
5. Enter an App Name (e.g., "Hello World Email Sender") and click "Create"
6. Copy the 16-character password that appears
7. Use this App Password (not your regular Gmail password) in the application

## Running the Application

### Development Mode

1. Start the server:
   ```
   npm run dev
   ```

2. In a separate terminal, start the client:
   ```
   npm run client
   ```

3. Access the application at `http://localhost:3000`

## Using the Application

### Generating and Sending Emails

1. Enter the sponsor's name and email
2. Enter your name and position (e.g., "Organizer", "President")
3. Toggle the AI option to use Gemini for email generation
4. Enter your Gmail address and App Password
5. Click "Generate AI Email" to create a customized email
6. Review and edit the email content if needed
7. Click "Send Email" to send directly via Gmail

### How Email Generation Works

The AI-powered email generator:
- Researches the specified company's offerings
- Identifies APIs and developer tools relevant for hackathon participants
- Creates a customized email requesting specific resources
- Focuses on tools that require credits, access, or licenses
- Tailors the content to highlight mutual benefits

### Email Format

The generated emails include:
- Introduction to Hello World Hackathon
- Company-specific APIs and developer tools
- Requests for access, credits, or licenses
- Benefits to the sponsor company
- Timeline information (event weekend is September 27-28)
- Professional sign-off with your name and position

## Security Notes

- Email credentials (password/App Password) are only used for the sending process
- Credentials are not stored by the application
- Always use an App Password rather than your actual Gmail password
- All communication with the Google API is encrypted

## Troubleshooting

### Email Sending Issues
- **401 Error**: Check that you're using an App Password, not your regular Gmail password
- **535 Error**: Authentication failed - verify your email and App Password are correct
- **Timeout Error**: Check your internet connection

### AI Generation Issues
- **API Key Error**: Verify your Gemini API key is correct in the .env file
- **Rate Limit**: If you hit rate limits, try again later or use the standard template

## License

MIT

## Acknowledgements

- Google Generative AI for the Gemini API
- Nodemailer for email functionality
- React and Chakra UI for the frontend interface 
