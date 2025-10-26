# Tripverse - Travel Community Platform

🌍 **Tripverse — for travelers, by travelers.**  
An open-source community platform for those who love to explore, share experiences, and connect through travel.

Welcome to **Tripverse**, a comprehensive travel storytelling and community platform designed to help travelers create, edit, and publish their adventure stories while building connections with fellow explorers. This project features a **React-based frontend** with **Redux state management** and a **Node.js/Express backend** with **Socket.IO real-time communication**, providing a seamless and interactive travel community experience.

## 📋 Table of Contents

- [🎥 Demo Video](#-demo-video)
- [✨ Key Features](#-key-features)
  - [🤖 AI-Powered Features](#-ai-powered-features)
  - [👥 Travel Community Features](#-travel-community-features)
  - [📝 Travel Content Management](#-travel-content-management)
  - [🎯 Personalized Travel Experience](#-personalized-travel-experience)
  - [🛡️ Admin Features](#️-admin-features)
- [🔐 Admin Portal](#-admin-portal)
  - [🚪 Access Control](#-access-control)
  - [📊 Admin Dashboard Features](#-admin-dashboard-features)
  - [👥 User Management](#-user-management)
  - [🔧 Technical Implementation](#-technical-implementation)
  - [🛡️ Security Features](#️-security-features)
  - [📈 Analytics & Monitoring](#-analytics--monitoring)
  - [🚀 Getting Started with Admin Portal](#-getting-started-with-admin-portal)
  - [🔒 Security Best Practices](#-security-best-practices)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [📚 API Documentation](#-api-documentation)
- [🔌 API Endpoints](#-api-endpoints)
- [🤖 AI Story Correction](#-ai-story-correction)
- [🔒 Authentication](#-authentication)
- [📊 Real-time Features](#-real-time-features)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨\u200d💻 Author](#️-author)
- [🙏 Acknowledgments](#-acknowledgments)

## 🎥 Demo Video

Watch the platform in action: [Tripverse Platform Demo](https://youtu.be/iT4rAaV9MhU?si=0sUBL6oLZnKGsrZH)

## ✨ Key Features

### 🤖 AI-Powered Features
- **Smart Story Correction**: AI-powered grammar, spelling, and mistake correction using OpenAI GPT-3.5-turbo
- **Travel Story Enhancement**: Improve travel story writing quality with intelligent suggestions and corrections
- **Fallback Systems**: Multiple AI providers (OpenAI, Hugging Face) for reliable mistake detection and correction

### 👥 Travel Community Features
- **Traveler Profiles**: Customizable profiles with avatars, names, and travel bios
- **Follow System**: Follow/unfollow fellow travelers and see their adventures in your feed
- **Real-time Chat**: Direct messaging between travelers for trip planning and sharing
- **Notifications**: Real-time notifications for likes, comments, and travel connections
- **Bookmarking**: Save inspiring travel stories and itineraries for later reference

### 📝 Travel Content Management
- **Rich Text Editor**: Advanced editor with TipTap for formatting travel stories
- **Image Uploads**: Multiple image support (up to 3 per post) using Cloudinary for travel photos
- **Tags System**: Organize content with travel-related tags and discoverability
- **CRUD Operations**: Create, read, update, and delete travel stories and experiences
- **Search & Filter**: Advanced search with tag filtering and pagination for travel content

### 🎯 Personalized Travel Experience
- **For You Feed**: Personalized content feed based on following and travel interactions
- **Trending Posts**: Discover popular travel content and destinations across the platform
- **Travel Analytics**: Track engagement and performance of your travel stories

### 🛡️ Admin Features
- **Admin Dashboard**: Comprehensive analytics and traveler management
- **User Management**: Role-based access control (traveler, admin, superadmin)
- **Content Moderation**: Monitor and manage travel stories and community
- **Analytics**: Detailed statistics and growth metrics for the travel community

## 🔐 Admin Portal

The Tripverse Admin Portal provides comprehensive administrative capabilities for managing the travel community platform. Access is restricted to users with `admin` or `superadmin` roles.

### 🚪 Access Control

#### User Roles
- **`user`** (default): Regular travelers with standard platform access
- **`admin`**: Can access admin dashboard, view analytics, and manage users
- **`superadmin`**: Full administrative privileges including role management

#### Authentication Flow
1. **Login**: Standard authentication via `/api/auth/login`
2. **Role Verification**: JWT token contains user role information
3. **Route Protection**: Frontend routes protected by `ProtectedRoute` component
4. **API Protection**: Backend routes protected by `adminAuth` and `superAdminAuth` middleware

### 📊 Admin Dashboard Features

#### Dashboard Analytics
- **User Statistics**: Total users, growth percentage, monthly trends
- **Content Metrics**: Total posts, comments, engagement analytics
- **Growth Charts**: Interactive charts showing user and post growth over time
- **Content Distribution**: Visual breakdown of posts vs comments
- **Recent Activity**: Latest users and top-performing posts

#### Visual Analytics
- **Line Charts**: User growth trends over 6 months
- **Bar Charts**: Post creation patterns
- **Doughnut Charts**: Content type distribution
- **Real-time Stats**: Live updates of platform metrics

### 👥 User Management

#### User Overview
- **User List**: Paginated table of all platform users
- **Search & Filter**: Find users by email, role, or status
- **User Details**: Email, username, role, status, join date
- **Status Management**: Activate/deactivate user accounts

#### Role Management (Superadmin Only)
- **Role Updates**: Change user roles between `user`, `admin`, `superadmin`
- **Account Status**: Enable/disable user accounts
- **Self-Protection**: Superadmins cannot demote themselves

### 🔧 Technical Implementation

#### Backend Architecture
```
server/
├── controllers/adminController.js    # Admin business logic
├── routes/adminRoutes.js             # Admin API endpoints
├── middleware/adminAuth.js           # Role-based authentication
└── models/user.js                    # User schema with roles
```

#### Frontend Components
```
client/src/
├── pages/AdminDashboard.jsx         # Main admin interface
├── components/ProtectedRoute.jsx     # Route protection
└── features/auth/authSlice.js       # Role state management
```

#### API Endpoints
- `GET /api/admin/dashboard/stats` - Dashboard analytics
- `GET /api/admin/users` - User management (admin+)
- `PUT /api/admin/users/:id/role` - Role updates (superadmin only)

### 🛡️ Security Features

#### Authentication Middleware
- **JWT Verification**: Token validation for all admin routes
- **Role Checking**: Ensures only authorized roles can access endpoints
- **Account Status**: Inactive accounts are blocked from admin access
- **Self-Protection**: Prevents accidental role demotion

#### Frontend Protection
- **Route Guards**: Admin routes protected by `ProtectedRoute`
- **Role Validation**: Client-side role checking before rendering
- **Access Denied**: Graceful error handling for unauthorized access

### 📈 Analytics & Monitoring

#### Dashboard Metrics
- **Total Users**: Active user count with growth percentage
- **Total Posts**: Content creation metrics
- **Total Comments**: Community engagement tracking
- **Growth Trends**: Month-over-month growth calculations

#### Data Visualization
- **Chart.js Integration**: Interactive charts and graphs
- **Real-time Updates**: Live data refresh capabilities
- **Export Options**: Data export for external analysis
- **Historical Data**: 6-month trend analysis

### 🚀 Getting Started with Admin Portal

#### Prerequisites
1. **Admin Account**: User account with `admin` or `superadmin` role
2. **Authentication**: Valid JWT token from login
3. **Access**: Navigate to `/admin` route

#### First-Time Setup
1. **Create Superadmin**: Manually set first user as `superadmin` in database
2. **Login**: Use superadmin credentials to access portal
3. **Create Admins**: Promote other users to admin role as needed

#### Admin Portal Access
1. **Login**: Standard login process
2. **Navigate**: Go to `/admin` route
3. **Dashboard**: View analytics and user management
4. **Manage**: Update user roles and account status

### 🔒 Security Best Practices

#### Role Management
- **Principle of Least Privilege**: Grant minimum required permissions
- **Regular Audits**: Review admin access periodically
- **Role Separation**: Distinguish between admin and superadmin capabilities
- **Account Monitoring**: Track admin actions and changes

#### Access Control
- **Token Expiration**: JWT tokens expire for security
- **Session Management**: Secure session handling
- **IP Restrictions**: Consider IP-based access controls
- **Audit Logging**: Log all administrative actions

## 🛠️ Technologies Used

### Frontend Stack
- **React 18**: Modern UI library with hooks and concurrent features
- **Redux Toolkit**: State management with RTK Query for API calls
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **React Router v7**: Client-side routing with data loading
- **TipTap**: Rich text editor with extensible functionality
- **Framer Motion**: Smooth animations and transitions
- **Socket.IO Client**: Real-time communication
- **Chart.js**: Data visualization for analytics
- **React Toastify**: Elegant notifications
- **Lucide React**: Modern icon library

### Backend Stack
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework with middleware support
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB with schema validation
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Secure authentication with JSON Web Tokens
- **Cloudinary**: Cloud-based image and video management
- **OpenAI API**: AI-powered content enhancement
- **Hugging Face**: Fallback AI services
- **Bcrypt**: Password hashing and security
- **Multer**: File upload handling
- **Express Rate Limit**: API rate limiting and protection

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 16 or higher
- **MongoDB**: Local installation or MongoDB Atlas cloud database
- **Cloudinary Account**: For image uploads and management
- **OpenAI API Key**: For AI-powered features (optional but recommended)

### 📦 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sameeraherath/tripverse.git
   cd tripverse
   ```

2. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**:
   
   Create a `.env` file in the `server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/tripverse
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # OpenAI API (Optional)
   OPENAI_API_KEY=your_openai_api_key
   
   # Hugging Face API (Fallback)
   HF_API_KEY=your_huggingface_api_key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the Application**:
   ```bash
   # Start the server (from server directory)
   npm run dev
   
   # Start the client (from client directory)
   npm run dev
   ```

5. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
tripverse/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices and feature logic
│   │   ├── contexts/      # React contexts (Socket.IO)
│   │   ├── store/         # Redux store configuration
│   │   └── utils/         # Utility functions and API calls
│   ├── public/            # Static assets
│   └── dist/              # Build output
├── server/                # Node.js backend application
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route definitions
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── config/           # Database configuration
└── api_docs/             # API documentation
```

## 📚 API Documentation

The Tripverse API is fully documented using OpenAPI 3.0.3 specification. The complete API documentation is available in the `api_docs/` folder.

### 📄 OpenAPI Specification

- **File**: `api_docs/openapi.yaml`
- **Format**: OpenAPI 3.0.3 (Swagger)
- **Size**: 2,278 lines of comprehensive documentation
- **Coverage**: All endpoints, schemas, and authentication methods

### 🔗 API Documentation Features

#### Complete Endpoint Coverage
- **Authentication**: Registration, login, and token management
- **Travel Stories**: CRUD operations for posts and stories
- **Profiles**: User profile management and social features
- **Comments**: Comment system for travel stories
- **Chat**: Real-time messaging endpoints
- **AI Features**: Story correction and enhancement
- **Admin**: Administrative functions and user management
- **FAQ**: Frequently asked questions and chatbot

#### Interactive Documentation
- **Request/Response Examples**: Detailed examples for all endpoints
- **Schema Definitions**: Complete data models and validation rules
- **Authentication Flow**: JWT token usage and security
- **Error Handling**: Comprehensive error response documentation

#### Server Information
- **Development**: `http://localhost:5000/api`
- **Production**: `https://tripverse-api.herokuapp.com/api`
- **Base Path**: `/api` for all endpoints

### 🛠️ Using the API Documentation

#### Viewing the Documentation
1. **OpenAPI Tools**: Use Swagger UI, Postman, or Insomnia to view the spec
2. **Online Viewers**: Upload `api_docs/openapi.yaml` to online OpenAPI viewers
3. **IDE Integration**: Many IDEs support OpenAPI specification viewing

#### API Testing
1. **Import**: Import the OpenAPI spec into your preferred API testing tool
2. **Authentication**: Use the documented JWT authentication flow
3. **Testing**: Test all endpoints with the provided examples

#### Development Integration
1. **Code Generation**: Generate client SDKs from the OpenAPI spec
2. **Validation**: Use the schemas for request/response validation
3. **Documentation**: Keep the spec updated as you add new features

### 📋 API Documentation Structure

```
api_docs/
└── openapi.yaml          # Complete OpenAPI 3.0.3 specification
    ├── Info & Servers     # API metadata and server configurations
    ├── Tags               # Endpoint categorization
    ├── Paths              # All API endpoints with detailed descriptions
    ├── Components         # Reusable schemas and security definitions
    └── Security           # JWT authentication specifications
```

### 🔧 API Documentation Maintenance

#### Keeping Documentation Updated
- **Version Control**: The OpenAPI spec is version controlled with the codebase
- **Synchronization**: Documentation is updated alongside API changes
- **Validation**: Regular validation ensures spec accuracy and completeness

#### Contributing to Documentation
1. **Update Spec**: Modify `api_docs/openapi.yaml` when adding new endpoints
2. **Examples**: Include realistic request/response examples
3. **Descriptions**: Provide clear descriptions for all parameters and responses
4. **Testing**: Verify documentation accuracy through API testing

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, filters)
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, author only)
- `DELETE /api/posts/:id` - Delete post (authenticated, author only)
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/bookmark` - Bookmark post
- `DELETE /api/posts/:id/bookmark` - Remove bookmark
- `GET /api/posts/tags/all` - Get all unique tags
- `GET /api/posts/tags/popular` - Get popular tags

### Profiles
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile (authenticated)
- `GET /api/profile/user/:userId` - Get user profile by ID
- `POST /api/profile/follow/:userId` - Follow user
- `DELETE /api/profile/follow/:userId` - Unfollow user
- `GET /api/profile/followers/:userId` - Get user's followers
- `GET /api/profile/following/:userId` - Get user's following
- `GET /api/profile/follow/status/:userId` - Check follow status
- `GET /api/profile/bookmarks` - Get bookmarked posts
- `GET /api/profile/bookmark/status/:postId` - Check bookmark status

### Comments
- `POST /api/comments` - Create comment (authenticated)
- `GET /api/comments/post/:postId` - Get post comments
- `DELETE /api/comments/:commentId` - Delete comment (authenticated, author only)

### Chat
- `GET /api/chats` - Get user's chats
- `GET /api/chats/unread-count` - Get unread message count
- `GET /api/chats/user/:userId` - Get or create chat with user
- `POST /api/chats/:chatId/message` - Send message
- `PUT /api/chats/:chatId/read` - Mark messages as read
- `DELETE /api/chats/:chatId` - Delete chat

### AI Features
- `POST /api/ai/fix-grammar` - Fix grammar, spelling, and mistakes in travel stories (rate limited)

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (superadmin only)

### FAQ
- `GET /api/faq` - Get all FAQs
- `GET /api/faq/:id` - Get FAQ by ID
- `GET /api/faq/search` - Search FAQs
- `GET /api/faq/category/:category` - Get FAQs by category
- `GET /api/faq/categories` - Get FAQ categories
- `POST /api/faq/chatbot` - Process chatbot query

## 🤖 AI Story Correction

Tripverse includes powerful AI assistance to help travelers write better stories:

- **Automatic Mistake Detection**: AI identifies grammar, spelling, and style issues in your travel stories
- **Smart Corrections**: Get intelligent suggestions to improve your writing while preserving your unique voice
- **Multiple AI Providers**: Uses OpenAI GPT-3.5-turbo with Hugging Face fallback for reliable correction
- **Rate Limited**: 10 corrections per hour to ensure fair usage across the community
- **Travel-Focused**: AI understands travel terminology and context for better suggestions

### How It Works
1. Write your travel story in the rich text editor
2. Click the AI correction button
3. Get instant suggestions for grammar, spelling, and style improvements
4. Accept or reject changes to maintain your authentic travel voice

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Real-time Features

The platform uses Socket.IO for real-time communication:

- **Chat Messages**: Real-time messaging between travelers
- **Typing Indicators**: Show when travelers are typing
- **Online Status**: Track traveler online/offline status
- **Notifications**: Real-time notifications for travel story interactions

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy with Node.js buildpack

## 🤝 Contributing

We welcome contributions to Tripverse! This project is open source and thrives on community participation. Whether you're fixing bugs, adding features, or improving documentation, your contributions help make Tripverse better for all travelers.

### 🚀 Getting Started

#### Prerequisites
- **Node.js** (v16 or higher)
- **Git** for version control
- **MongoDB** (local or Atlas)
- **Basic knowledge** of React, Node.js, and MongoDB

#### Development Setup
1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/tripverse.git
   cd tripverse
   ```

2. **Set Up Development Environment**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm run dev
   
   # Terminal 2: Start frontend development server
   cd client
   npm run dev
   ```

### 📋 Contribution Guidelines

#### Types of Contributions
- **🐛 Bug Fixes**: Report and fix issues
- **✨ New Features**: Add new functionality
- **📚 Documentation**: Improve docs and examples
- **🎨 UI/UX**: Enhance user interface and experience
- **🧪 Testing**: Add or improve tests
- **🔧 Refactoring**: Code quality improvements
- **🌐 Translations**: Add language support

#### Code Standards
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Conventional Commits**: Use conventional commit messages
- **TypeScript**: Use TypeScript for type safety (where applicable)
- **Testing**: Write tests for new features and bug fixes

#### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Add comments for complex logic
   - Update documentation if needed
   - Add tests for new functionality

3. **Test Your Changes**
   ```bash
   # Run tests
   npm test
   
   # Check linting
   npm run lint
   
   # Build to ensure no errors
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new travel story sharing feature"
   # Use conventional commit format
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Then create PR on GitHub
   ```

### 🎯 Areas for Contribution

#### High Priority
- **🔍 Search Improvements**: Enhanced search algorithms and filters
- **📱 Mobile Responsiveness**: Better mobile experience
- **🌍 Internationalization**: Multi-language support
- **🔒 Security Enhancements**: Security audit and improvements
- **📊 Analytics**: Better user analytics and insights

#### Medium Priority
- **🎨 UI Components**: New reusable components
- **📈 Performance**: Optimization and caching
- **🧪 Testing**: Increase test coverage
- **📚 Documentation**: API docs and guides
- **🔧 Developer Tools**: Better development experience

#### Low Priority
- **🎨 Themes**: Dark mode and custom themes
- **🔌 Integrations**: Third-party service integrations
- **📱 PWA Features**: Progressive web app capabilities
- **🤖 AI Features**: Enhanced AI capabilities

### 🐛 Reporting Issues

#### Before Reporting
- **Search existing issues** to avoid duplicates
- **Check documentation** for solutions
- **Test with latest version** to ensure it's not fixed

#### Issue Template
When reporting bugs, please include:
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 10, macOS, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

**Additional Context**
Any other context about the problem.
```

### 💡 Feature Requests

#### Before Requesting
- **Check existing features** to avoid duplicates
- **Consider the scope** and complexity
- **Think about user impact** and use cases

#### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

### 🏆 Recognition

#### Contributors
We recognize all contributors in our project:
- **Code Contributors**: Listed in CONTRIBUTORS.md
- **Documentation Contributors**: Recognized in README
- **Bug Reporters**: Thanked in issue comments
- **Community Helpers**: Acknowledged in discussions

#### Contribution Levels
- **🥉 Bronze**: 1-5 contributions
- **🥈 Silver**: 6-15 contributions  
- **🥇 Gold**: 16+ contributions
- **💎 Diamond**: Major feature contributions

### 📞 Getting Help

#### Community Channels
- **GitHub Discussions**: For questions and ideas
- **Issues**: For bug reports and feature requests
- **Discord**: Real-time community chat (if available)
- **Email**: Contact maintainers directly

#### Resources
- **Documentation**: Comprehensive guides and API docs
- **Code Examples**: Sample implementations
- **Video Tutorials**: Step-by-step guides
- **Community Wiki**: Community-maintained resources

### 📜 Code of Conduct

#### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education
- Nationality, personal appearance
- Race, religion, sexual orientation

#### Expected Behavior
- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Be patient** with newcomers
- **Be professional** in all interactions

#### Unacceptable Behavior
- Harassment, trolling, or discrimination
- Personal attacks or inappropriate language
- Spam or off-topic discussions
- Any behavior that makes others uncomfortable

### 📝 License

By contributing to Tripverse, you agree that your contributions will be licensed under the same MIT License that covers the project.

### 🙏 Thank You

Thank you for considering contributing to Tripverse! Every contribution, no matter how small, helps make this platform better for travelers worldwide.

**Happy coding and safe travels! 🌍✈️**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sameera Herath**
- GitHub: [@sameeraherath](https://github.com/sameeraherath)
- LinkedIn: [Sameera Herath](https://linkedin.com/in/sameeraherath)

## 🙏 Acknowledgments

- OpenAI for AI-powered content enhancement
- Cloudinary for image management services
- MongoDB for database services
- All contributors and users of the platform
