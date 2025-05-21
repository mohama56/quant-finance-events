# Cornell Quantitative Finance Group Registration System

A simple web application for managing guest speaker event registrations for the Cornell MSBA Quantitative Finance Group.

## Overview

This application consists of:
- A React frontend with a registration form and team information page
- Firebase Firestore for storing registration data

## Features

- Event registration form with dynamic fields based on Cornell affiliation
- Team information page showcasing group leadership
- Firebase Firestore integration for reliable data storage
- Support for different attendee types (Current Students, Incoming Students, Alumni, etc.)

## Project Structure

```
signupform/
├── src/                    # Frontend React code
│   ├── components/
│   │   ├── SignUpForm.js   # Registration form component
│   │   ├── TeamPage.js     # Team information page
│   │   └── AdminPage.js    # Admin dashboard component (optional)
│   ├── services/
│   │   └── api.js          # API service for Firebase communication
│   ├── firebase.js         # Firebase configuration
│   ├── App.js              # Main application with routing
│   └── index.js            # Entry point
└── public/                 # Static assets
    ├── CornellLogo copy.png # Cornell logo
    └── JohnSouthcott.png    # Speaker image
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mohama56/quant-finance-events.git
cd signupform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `firebase.js` file in the src directory with your Firebase configuration:
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

### Running the Application

1. Start the development server:
```bash
npm start
```
The application will run on http://localhost:3000

## Firebase Integration

The application now uses Firebase for data storage and hosting:

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Set up Firestore database with appropriate security rules
3. Enable Firebase Hosting
4. Add the Firebase configuration to your project (see installation above)

### Deploying to Firebase

1. Login to Firebase CLI:
```bash
firebase login
```

2. Initialize Firebase in the project:
```bash
firebase init
```
- Select Hosting and Firestore features
- Choose your Firebase project
- Set `build` as your public directory
- Configure as a single-page app: Yes

3. Build the application:
```bash
npm run build
```

4. Deploy to Firebase:
```bash
firebase deploy
```

## Usage

### Registration Form

The registration form collects:
- First and last name
- Email address
- Cornell affiliation
- Cornell-specific information (NetID, program, graduation year) based on affiliation type
- Attendance confirmation
- Questions for the speaker

### Team Page

The Team page displays information about the leadership team of the Cornell Quantitative Finance Group, including:
- Managing Director and Treasurer
- Chief Investment Officer
- Various department heads (Equities, Crypto, ETFs, etc.)

## Development

### Adding New Fields to the Registration Form

1. Update the `formData` state in `SignUpForm.js`
2. Add the new field to the form UI
3. Make sure to update the submission handling to include the new field

### Modifying Team Information

Update the `teamMembers` array in `TeamPage.js` with new member details or role changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, contact the Cornell Quantitative Finance Group.
