# Boom Social Streaming Platform - Making the Boom Feed

## Features

### Core Features
- **User Authentication**: Registration and login with JWT tokens
- **Video Upload**: Support for both short-form (.mp4 files) and long-form (external URLs) videos
- **Unified Feed**: Scrollable feed displaying both video types sorted by upload date
- **Video Interaction**: Auto-play for short videos, embedded player for long videos
- **Monetization**: Mock wallet system with video purchasing functionality
- **Comments**: Real-time commenting system for all videos
- **Gifting**: Creator gifting system with wallet integration

### Technical Features
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Express.js with RESTful API design
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Multer for handling video file uploads
- **Authentication**: JWT-based authentication
- **Responsive Design**: Mobile-first responsive UI

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install #or
pnpm install #or
yarn install #or
bun install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with. Copy the `.env.example` file.

4. Start the Docker desktop and run the `docker-compose.yml` file.
```bash
docker compose up -d

# Check all images and container or running or not in Docker Desktop or by running the command
docker ps
```

5. Set up the database:
```bash
# Create Prisma db migrations
npx prisma migrate dev --name init

# Generate prisma client
npx prisma generate

# Run the Prisma studio to show the tables
npx prisma studio
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:8080`

### Frontend Setup

1. In the root directory, install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Videos
- `POST /api/videos/upload` - Upload video (with file for short-form or URL for long-form)
- `GET /api/videos` - Get paginated video feed
- `GET /api/videos/:id` - Get specific video details
- `POST /api/videos/purchase` - Purchase a paid video

### Comments
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comments` - Add comment to video

### Gifts
- `POST /api/videos/:id/gift` - Send gift to video creator

## Database Schema

### Users
- `id` (String, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `walletBalance` (Integer, Default: 500)

### Videos
- `id` (String, Primary Key)
- `title` (String)
- `description` (String)
- `type` (Enum: SHORT_FORM | LONG_FORM)
- `videoFile` (String, Optional - for short-form)
- `videoUrl` (String, Optional - for long-form)
- `price` (Integer, Default: 0)
- `creatorId` (String, Foreign Key)

### Comments
- `id` (String, Primary Key)
- `content` (String)
- `userId` (String, Foreign Key)
- `videoId` (String, Foreign Key)

### Purchases
- `id` (String, Primary Key)
- `amount` (Integer)
- `userId` (String, Foreign Key)
- `videoId` (String, Foreign Key)

### Gifts
- `id` (String, Primary Key)
- `amount` (Integer)
- `fromUserId` (String, Foreign Key)
- `toUserId` (String, Foreign Key)
- `videoId` (String, Foreign Key)

## Backend Architecture

### Directory Structure
```plaintext
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server startup and shutdown
│   ├── config/                # Configuration files
│   │   ├── database.js        # Prisma client setup
│   │   └── jwt.js             # JWT configuration
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.js
│   │   ├── video.controller.js
│   │   ├── user.controller.js
│   │   ├── comment.controller.js
│   │   └── gift.controller.js
│   ├── middlewares/           # Custom middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── validation.js      # Input validation
│   │   ├── errorHandler.js    # Error handling
│   │   ├── logger.js          # Request logging
│   │   └── upload.js          # File upload handling
│   ├── routes/                # Route definitions
│   │   ├── auth.route.js
│   │   ├── videos.route.js
│   │   ├── users.route.js
│   │   ├── comments.route.js
│   │   └── gifts.route.js
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── video.service.js
│   │   ├── user.service.js
│   │   ├── comments.service.js
│   │   └── gift.service.js
│   └── utils/                 # Utility functions
│       └── fileSystem.js
├── prisma/                    # Database schema and migrations
└── uploads/                   # File storage
```

### Design Patterns

#### 1. **MVC Pattern**
- **Models**: Prisma schema definitions
- **Views**: JSON API responses
- **Controllers**: Request/response handling

#### 2. **Service Layer Pattern**
- Business logic separated from controllers
- Reusable service functions
- Database operations abstracted

#### 3. **Middleware Pattern**
- Authentication, validation, logging
- Error handling centralized
- Request preprocessing

#### 4. **Repository Pattern** (via Prisma)
- Database abstraction
- Query optimization
- Type safety

## Frontend Architecture

### Directory Structure
```plaintext
frontend/
├──app/
│   ├── api/                       # For handling API requests of login, register etc.
│   ├── components/                # Reusable components
│   │   ├── auth/                  # Authentication components
│   │   ├── feed/                  # Feed-related components
│   │   ├── video/                 # Video components
│   │   └── ui/                    # Base UI components using 
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries=
│   │── utils/                     # Helper functions
```

### Design Patterns

#### 1. **Component Composition**
- Small, focused components
- Reusable UI elements
- Props-based communication

#### 2. **Custom Hooks Pattern**
- State management logic extraction
- Reusable stateful logic
- Side effect management

#### 3. **Service Layer Pattern**
- API calls abstracted
- Centralized HTTP logic
- Error handling consistency

#### 4. **Container/Presentational Pattern**
- Smart containers manage state
- Dumb components handle presentation
- Clear separation of concerns

## Key Benefits

### 1. **Maintainability**
- Clear separation of concerns
- Easy to locate and modify code
- Consistent patterns throughout

### 2. **Scalability**
- Modular structure supports growth
- Easy to add new features
- Independent component development

### 3. **Testability**
- Isolated functions and components
- Easy to mock dependencies
- Clear interfaces for testing

### 4. **Reusability**
- Components can be reused
- Services shared across features
- Consistent API patterns

### 5. **Developer Experience**
- Clear file organization
- Predictable code structure
- Easy onboarding for new developers

## Code Quality Standards

### 1. **TypeScript Usage**
- Strong typing throughout
- Interface definitions
- Type safety enforcement

### 2. **Error Handling**
- Consistent error responses
- Proper HTTP status codes
- User-friendly error messages

### 3. **Validation**
- Input validation on both ends
- Schema-based validation
- Security-focused validation

### 4. **Documentation**
- Clear function documentation
- API endpoint documentation
- Architecture documentation

This modular architecture demonstrates professional software development practices and makes the codebase maintainable, scalable, and easy to understand.

Perfect! I've completely refactored the entire codebase to be properly modular and organized. Here's what I've accomplished:

## 🏗️ **Backend Modularization**

### **Separated into logical layers:**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Routes**: Define API endpoints
- **Middleware**: Handle cross-cutting concerns
- **Config**: Centralized configuration
- **Utils**: Helper functions

### **Key improvements:**
- Clean separation of concerns
- Reusable service functions
- Centralized error handling
- Modular middleware system
- Type-safe validation schemas

## 🎨 **Frontend Modularization**

### **Component organization:**
- **Auth components**: Login, register, forms
- **Feed components**: Header, search, video cards
- **UI components**: Reusable elements
- **Custom hooks**: State management logic
- **API services**: HTTP request handling
- **Utils**: Helper functions and constants

## Usage

1. **Registration/Login**: Create an account or login with existing credentials
2. **Upload Videos**: Use the upload page to add short-form (.mp4) or long-form (URL) videos
3. **Browse Feed**: Scroll through the unified feed to discover content
4. **Watch Videos**: Click on videos to watch them in the player page
5. **Purchase Content**: Buy paid long-form videos using your wallet balance
6. **Interact**: Comment on videos and gift creators
7. **Wallet Management**: Monitor your balance and transaction history

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- File upload validation and size limits
- SQL injection prevention with Prisma
- CORS configuration for API security

## Future Enhancements

- Real-time notifications
- Video streaming optimization
- Advanced search and filtering
- Creator analytics dashboard
- Payment gateway integration
- Mobile app development