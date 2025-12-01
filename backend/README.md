# Social Media Backend API

This is the backend API for a social media application built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/social-media-app
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

3. Start the server:
   ```
   npm run dev
   ```

The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST /api/register**: Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string", "profilePic": "string" }`

- **POST /api/login**: Login user
  - Body: `{ "email": "string", "password": "string" }`

### Profile

- **GET /api/profile**: Get user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`

### Posts

- **POST /api/posts**: Create a new post (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "content": "string", "image": "string" }`

- **PUT /api/posts/:id**: Edit a post (requires authentication, owner only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "content": "string", "image": "string" }`

- **GET /api/my-posts**: Get user's posts (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Query: `?page=1&limit=10`

- **GET /api/posts**: Get all posts (newsfeed) (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Query: `?page=1&limit=10`

- **POST /api/posts/:id/comments**: Add a comment to a post (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "content": "string" }`

- **POST /api/posts/:id/reaction**: Toggle like/unlike on a post (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "type": "like" }`

## Validation

- Email must be unique
- Password must be at least 8 characters long
- Required fields: name, email, password for registration; email, password for login; title, content for posts

## Error Handling

All endpoints return JSON responses with status and message fields. Errors are handled with appropriate HTTP status codes.
