Dra.Wave CSC 437 Final Project
Dra.Wave is a full stack, client rendered music sharing web application built for CSC 437.
Users can create accounts, upload audio tracks with cover images, browse a public feed, view profiles, and exchange messages.

The application is fully deployed to a production environment and accessible via HTTPS.

Live Deployment
URL: https://tkoncok.csse.dev
No local setup is required to use the app.

How to Use the App (For Grading)
1. Create an Account
	•	Click Sign Up in the navigation bar
	•	Enter a username and password
	•	Optionally upload a profile image
	•	Submit the form to create an account

Authentication is handled using JWTs, and protected routes require a valid session.

2. Log In
	•	Click Log In
	•	Enter your credentials
	•	Upon success, you will be redirected to the home feed
	•	Your username (or avatar, if uploaded) will appear in the header

3. Browse the Feed
	•	The Home page displays all uploaded audio posts
	•	Each post includes:
	•	Title
	•	Artist
	•	Cover image
	•	Audio playback controls
	•	All feed data is loaded dynamically from the backend REST API

4. Upload an Audio Track
	•	Navigate to the Upload page
	•	Fill in:
	•	Title (required)
	•	Genre (optional)
	•	Cover image (optional)
	•	Audio file (required)
	•	Submit the form

The uploaded track will immediately appear in the feed and on your profile.

5. Play Audio
	•	Click the Play button on any post
	•	Audio is streamed directly from the server using browser-native controls

6. View Profiles
	•	Click your username or avatar in the header
	•	Your profile displays:
	•	Username
	•	Profile image (if uploaded)
	•	Your uploaded posts

7. Messaging
	•	Navigate to the Messages page
	•	Send and receive messages with other users
	•	Messaging routes are protected and require authentication

Technical Overview
	•	Frontend
	•	Client-rendered SPA using Lit
	•	MVU architecture via @calpoly/mustang
	•	Client-side routing (no page reloads)
	•	Fetch API for backend communication
	•	Backend
	•	Node.js + Express
	•	RESTful JSON APIs
	•	JWT-based authentication
	•	File uploads via Multer
	•	MongoDB for persistent storage
	•	Database
	•	MongoDB Atlas (cloud-hosted)
	•	Users, audio posts, comments, and messages stored persistently
	•	Deployment
	•	Hosted on a Linode VPS
	•	HTTPS handled via reverse proxy on csse.dev
	•	Frontend served from Express
	•	Backend runs on port 3000 behind Nginx

Environment & Security Notes
	•	No secrets or credentials are stored in the repository
	•	Environment variables are managed via .env on the VPS
	•	Authentication tokens are stored client-side and sent via Authorization headers
	•	Uploads are stored server-side and served via static routes
