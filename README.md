# EPMOC | CONTROL SYSTEM v2.0

A modern, responsive, and animated web application for the Event Planning, Management & Organising Council (EPMOC) at IIIT Una.

## Overview

The EPMOC website has evolved into a full-stack MERN (MongoDB, Express, React, Node.js) application, featuring dynamic event management, secure Google OAuth login, and a centralized recruitment request system.

## Key Features

- **Full MERN Stack Architecture**: Cleanly separated `client` and `server` environments.
- **Secure Authentication**: Built-in Google OAuth integration and JWT-based session management.
- **Dynamic Event Management**: View event archives, detailed event pages, and administrative controls to manage fests and activities.
- **Recruitment / Join Requests**: Dedicated portals and backend pipelines for managing new club members.
- **Immersive Frontend UI**: 
  - **Interactive 3D Loader**: Seamlessly integrated Spline 3D scene.
  - **Smooth Scrolling**: Implemented using Lenis for a fluid user experience.
  - **GSAP Animations**: Complex scroll-triggered reveals, letter-by-letter hero animations, and custom cursor tracking.
  - **Dynamic Gallery**: View past event logs and photos.

## Project Structure

- `/client`: React frontend powered by Vite and Tailwind CSS v4.
- `/server`: Node.js backend powered by Express, MongoDB/Mongoose, and Googleapis.

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/EPMOCIIITU/EpmocWebsite.git
cd EpmocWebsite
```

### 2. Environment Variables
You will need to set up environment variables for the backend (e.g., MongoDB connection URI, Google OAuth client keys, JWT Secrets). Create a `.env` file in the `/server` directory and add the necessary configuration based on your development environment.

### 3. Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### 4. Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open your browser to the local URL provided by Vite.

## Build for Production (Frontend)

```bash
cd client
npm run build
```
The optimized assets will be output to the `client/dist` folder. The application is also pre-configured for seamless serverless deployment on Vercel via the `vercel.json` file.
