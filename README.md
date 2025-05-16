# Authentication and User Management API

This API provides authentication and user management functionality, including user signup, signin, OTP verification, password change, and profile management. The backend is built using Express and MongoDB.

## Environment Variables

Before starting the project, ensure that you have the following environment variables configured in your `.env` file:

```env
PORT=3000
DATABASE=mongodb://localhost:27017/mydb
MONGODB_PASSWORD=your_mongo_password
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

### Description of Environment Variables:

- `PORT`: The port on which the server will run.
- `DATABASE`: The connection string for your MongoDB instance (including username, password, and database name).
- `MONGODB_PASSWORD`: The password for your MongoDB database.
- `JWT_SECRET_KEY`: The secret key used to sign JSON Web Tokens for secure authentication.
- `JWT_EXPIRES_IN`: The expiration time for JWT tokens (e.g., `1h`, `2d`).

## Routes

### Authentication Routes

- `POST /signup`: User signup.

  - **Request body**:

    - `email`: Valid email format.
    - `password`: Validates length and complexity (at least 8 characters).
    - `firstName`: Required.
    - `lastName`: Required.
    - `countryCode`: Must be a valid country code.
    - `contact`: Valid phone number format.
    - `dob`: A valid date of birth and checks for legal age.

  - **Validation**: Input data is validated using `validateSignup` middleware.

- `POST /signin`: User login.

  - **Request body**:

    - `email`: User's email address.
    - `password`: User's password.

  - **Validation**: Input data is validated using `validateSignin` middleware.

- `POST /sendOtp`: Sends an OTP (One Time Password) to the user's email for verification.

  - **Request body**:

    - `email`: User's email address.

- `PATCH /verifyotp`: Verifies the OTP sent to the user.

  - **Request body**:

    - `otp`: The OTP entered by the user.

- `PATCH /changepassword`: Allows the user to change their password.

  - **Request body**:

    - `oldPassword`: Current password.
    - `newPassword`: New password.

  - **Validation**: Password is validated using the `validatePassword` middleware.

- `POST /resetPassword`: Allows the user to reset their password using an OTP.

  - **Request body**:

    - `otp`: The OTP sent to the user.
    - `newPassword`: The new password for the user.

  - **Validation**: New password is validated using the `validatePassword` middleware.

### User Routes

- `GET /profile`: Fetches the authenticated user's profile information.

  - **Authentication**: This route is protected, and users must be authenticated to access it.

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://your-repository-url
   cd your-project-directory
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory of the project and add the required environment variables (refer to the "Environment Variables" section above).

4. **Start the server**:

   ```bash
   npm start
   ```

   By default, the server will run on `http://localhost:3000`, unless you specify a different port in the `.env` file.

## Dependencies

- `express`: Web framework for Node.js.
- `jsonwebtoken`: JWT utility for authentication.
- `mongoose`: ODM for MongoDB to interact with the database.
- `dotenv`: For loading environment variables from the `.env` file.
- `bcryptjs`: For hashing passwords.

## Folder Structure

```
├── controllers/
│   ├── authController.js      # Authentication-related functions (signup, signin, etc.)
│   └── userController.js      # User profile-related functions
├── routes/
│   ├── authRoutes.js          # Routes for authentication
│   └── userRoutes.js          # Routes for user profile
├── utils/
│   └── validator.js           # Validation utilities for request bodies
├── .env                       # Environment variables (should not be committed)
├── package.json               # Project dependencies and scripts
└── server.js                  # Entry point of the application
```

## Notes

- All routes except the authentication routes (`/signup`, `/signin`, `/sendOtp`) are protected by JWT authentication. You will need to include the `Authorization` header with a valid token when making requests to those routes.
- Ensure MongoDB is running and accessible with the credentials provided in the `.env` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
