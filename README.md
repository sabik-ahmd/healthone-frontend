HealthOne+ 🏥 - Healthcare Management System

https://img.shields.io/badge/HealthOne%252B-Healthcare-blue?style=for-the-badge&logo=health&logoColor=white
https://img.shields.io/badge/React-18.2-blue?logo=react
https://img.shields.io/badge/Redux-8.1-purple?logo=redux
https://img.shields.io/badge/Tailwind-3.3-teal?logo=tailwind-css
https://img.shields.io/badge/Deployed-Netlify-green?logo=netlify

A modern, responsive healthcare platform for medicine delivery, doctor consultations, and comprehensive health management.
✨ Features
👨‍⚕️ Patient & Doctor Portal

    User Authentication - Secure login/register with JWT tokens

    Doctor Appointments - Book and manage consultations

    Prescription Management - Digital prescription handling

    Health Records - Track medical history and reports

💊 Pharmacy & Medicine

    Medicine Catalog - Browse extensive medicine database

    Prescription Upload - Upload and verify prescriptions

    Shopping Cart - Add medicines to cart

    Order Tracking - Real-time order status updates

🛡️ Security & Privacy

    HIPAA Compliant - Patient data protection

    End-to-End Encryption - Secure communications

    Role-Based Access - Patient, Doctor, Pharmacist, Admin

📱 User Experience

    Responsive Design - Mobile-first approach

    Dark/Light Mode - Customizable themes

    Real-time Notifications - Order and appointment alerts

    Multi-language Support - Global accessibility

🛠️ Tech Stack
Frontend

    React 18 - Component-based UI library

    Redux Toolkit - State management

    React Router v6 - Navigation and routing

    Axios - HTTP client with interceptors

    Framer Motion - Animations and transitions

    Lucide React - Icon library

    React Hook Form - Form validation

Styling

    Tailwind CSS - Utility-first CSS framework

    CSS Modules - Component-scoped styles

    PostCSS - CSS processing

Build & Deployment

    Vite - Fast build tool

    ESLint - Code linting

    Prettier - Code formatting

    Netlify - Hosting and CI/CD

🚀 Live Demo

    Frontend: https://healthone-plus.netlify.app

    Backend API: https://healthone-plus-backend.onrender.com

    API Documentation: https://healthone-plus-backend.onrender.com/api

Demo Credentials:

    Patient: patient@healthone.com / demo123

    Doctor: doctor@healthone.com / demo123

    Admin: admin@healthone.com / admin123

📦 Installation & Setup
Prerequisites

    Node.js 18+ and npm/yarn

    Git for version control

    Backend server running (or use demo API)

Local Development

1.  Clone the repository
    git clone https://github.com/sabik-ahmd/healthone-frontend.git
    cd healthone-frontend

    2.Install dependencies
    npm install


    # or
    yarn install

    3. Configure environment variables
    # Copy environment template
    cp .env.example .env.development

    # Edit with your configuration
    # REACT_APP_API_URL=http://localhost:5000/api
    # REACT_APP_ENV=development

    4. Start development server
    npm start
    # or
    yarn start
    App will open at http://localhost:3000

Production Build

# Create optimized production build

npm run build

# Preview production build locally

npm run preview

⚙️ Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_SITE_NAME=HealthOne+
REACT_APP_CONTACT_EMAIL=support@healthoneplus.com

📁 Project Structure
src/
├── components/ # Reusable UI components
│ ├── common/ # Buttons, inputs, modals
│ ├── layout/ # Header, footer, sidebar
│ └── ui/ # Cards, tables, forms
├── pages/ # Route pages
│ ├── auth/ # Login, register, forgot password
│ ├── dashboard/ # User dashboard
│ ├── products/ # Medicine catalog
│ └── appointments/ # Doctor bookings
├── redux/ # State management
│ ├── slices/ # Redux slices
│ └── store.js # Redux store configuration
├── services/ # API services
├── utils/ # Helper functions
├── hooks/ # Custom React hooks
├── constants/ # App constants
├── styles/ # Global styles
├── assets/ # Images, fonts, icons
└── config/ # App configuration

🔧 Available Scripts

    npm start - Start development server

    npm run build - Create production build

    npm run preview - Preview production build

    npm run lint - Run ESLint

    npm run format - Format code with Prettier

    npm test - Run tests

🎨 Design System
Colors
--primary: #2563eb; /_ Blue for healthcare trust _/
--secondary: #0ea5e9; /_ Light blue for accents _/
--success: #10b981; /_ Green for success states _/
--danger: #ef4444; /_ Red for errors/warnings _/
--warning: #f59e0b; /_ Yellow for warnings _/
--background: #f8fafc; /_ Light background _/
--card: #ffffff; /_ White for cards _/

Typography

    Primary Font: Inter (Sans-serif)

    Headings: 700 weight

    Body: 400 weight

    Code: Fira Code (Monospace)

🔌 API Integration
Base Configuration
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
baseURL: process.env.REACT_APP_API_URL,
timeout: 10000,
headers: {
'Content-Type': 'application/json',
},
});

// Add JWT token automatically
api.interceptors.request.use(config => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

Example API Call

// Login user
const login = async (email, password) => {
const response = await api.post('/auth/login', { email, password });
return response.data;
};

📱 Responsive Breakpoints
/_ Tailwind CSS breakpoints _/
sm: 640px /_ Mobile _/
md: 768px /_ Tablet _/
lg: 1024px /_ Laptop _/
xl: 1280px /_ Desktop _/
2xl: 1536px /_ Large desktop _/

🧪 Testing

# Run unit tests

npm test

# Run tests with coverage

npm test -- --coverage

# Run specific test file

npm test -- Login.test.js

📊 Performance

    Lighthouse Score: 95+ (Performance, Accessibility, SEO)

    Bundle Size: < 500KB gzipped

    First Contentful Paint: < 1.5s

    Time to Interactive: < 3s

🔒 Security Best Practices

    JWT Tokens - Stateless authentication

    HTTPS Only - All API calls encrypted

    CORS Configuration - Restrict API access

    Input Sanitization - Prevent XSS attacks

    Rate Limiting - API request limiting

    Content Security Policy - Prevent code injection

🤝 Contributing

We welcome contributions! Please follow these steps:

    Fork the repository

    Create a feature branch (git checkout -b feature/AmazingFeature)

    Commit your changes (git commit -m 'Add AmazingFeature')

    Push to the branch (git push origin feature/AmazingFeature)

    Open a Pull Request

Commit Guidelines

    Use semantic commit messages

    Follow conventional commits specification

    Reference issue numbers when applicable

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
👥 Team & Contributors

    Sabik Ahmd - Project Lead & Full Stack Developer

    Contributors - List of contributors

📞 Support & Contact

    Email: support@healthoneplus.com

    Website: healthoneplus.com

    Issues: GitHub Issues

    Discussions: GitHub Discussions

🙏 Acknowledgments

    Create React App - React project bootstrapping

    Tailwind CSS - CSS framework

    Lucide Icons - Beautiful icon set

    Framer Motion - Animation library

    Render - Backend hosting

    Netlify - Frontend hosting

<div align="center">
Made with ❤️ for better healthcare

https://img.shields.io/github/stars/sabik-ahmd/healthone-frontend?style=social
https://img.shields.io/github/forks/sabik-ahmd/healthone-frontend?style=social
https://img.shields.io/github/issues/sabik-ahmd/healthone-frontend

</div>
