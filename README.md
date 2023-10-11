# Munch-meter: Competitive Cooking Student Website

Munch-meter is a web application designed for cooking students to showcase their culinary skills, compete with peers, and build a community around their love for food. It features a custom Elo-based ranking system, user accounts, image uploads, a leaderboard, and authorization.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
   
## Features

### 1. User Accounts

- Users can create accounts with a unique username and password.
- Passwords are securely hashed and stored in the database.
- User data includes a profile image and Elo rating.

### 2. Image Upload

- Users can upload images of their culinary creations.
- Images are stored on the server and associated with user accounts.

### 3. Custom Elo Ranking System

- The website implements a custom Elo rating system for ranking users' cooking skills.
- Users gain or lose Elo points based on the outcome of cooking competitions.

### 4. Authorization

- Users can only interact with their own account and data, such as uploading images and viewing their Elo rating.

### 5. Leaderboard

- A dynamic leaderboard displays the top-ranked cooking students with their usernames and elo ratings displayed

### 6. Moderation

- Integrated SightEngine API to the website to prevent explicit images from being uploaded
  
## Technologies Used

- Frontend: React
- Backend: Python Flask
- Database: MySQL (Local)
- Authentication: JWT, LocalStorage
- Image Storage: Local storage
