# Hello World Hackathon - Sponsorship Email Sender

A full-stack web application that automates sending sponsorship request emails for Hello World Hackathon at Purdue University.

## Features

- Automatically generate professional sponsorship request emails
- Preview emails before sending
- Simple form for entering sponsor details
- Beautiful UI with Chakra UI components

## Tech Stack

- **Frontend**: React, Chakra UI
- **Backend**: Node.js, Express
- **Email Service**: Nodemailer

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

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

### Configuration

For email functionality, you'll need to use your Gmail account. For security reasons, it's recommended to use an App Password instead of your actual Gmail password.

To generate an App Password:
1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. At the bottom, click on "App passwords"
4. Generate a new app password for this application

## Running the Application

### Development Mode

1. Start the server
   ```
   npm run dev
   ```

2. In a separate terminal, start the client
   ```
   npm run client
   ```

3. Access the application at `http://localhost:3000`

### Production Mode

For deployment:

1. Build the client
   ```
   npm run build-client
   ```

2. Start the production server
   ```
   npm start
   ```

## Usage

1. Enter the sponsor's name and email address
2. Enter your Gmail email and App Password
3. Preview the email by clicking the "Preview Email" button
4. Send the email by clicking the "Send Email" button

## Security Notes

- This application requires your Gmail credentials to send emails
- We recommend using an App Password instead of your actual password
- The password is only used to authenticate with Gmail's SMTP servers and is not stored anywhere
- For production use, consider implementing OAuth2 authentication for more security

## License

MIT 