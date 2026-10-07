# Real Estate Listing Platform

[![Live Demo](https://real-estate-project-six-eosin.vercel.app/)

## Overview

A full-stack real estate web application built with React.js, Node.js, Express.js, and MongoDB. The platform allows users to create accounts, authenticate securely, browse property listings, and manage their own real estate listings through a protected application workflow.

The project demonstrates how a modern real estate platform can be structured using a separate frontend and backend, RESTful APIs, database-driven property management, authentication middleware, and cloud deployment.

##Key Features

User Registration & Authentication — Users can create accounts and securely sign in to the application.

Google Authentication — Supports Google sign-in through Firebase Authentication.

Protected Routes — Restricted pages such as listing creation are available only to authenticated users.

Property Listings — Users can create and manage real estate listings through the application.

Listing Management — Property information is handled through backend APIs and MongoDB.

User-Based Listings — Listings are associated with users, allowing the application to identify listing ownership.

RESTful Backend APIs — Express.js routes provide structured endpoints for authentication, users, and listings.

JWT Authentication — Authentication is maintained using JSON Web Tokens and HTTP cookies.

Secure Cookie Handling — Production authentication supports secure cross-origin cookies.

Firebase OAuth Integration — Google OAuth is integrated through Firebase.

MongoDB Database — Stores user accounts, property listings, and application data.

Cloud Database Support — Production deployment uses MongoDB Atlas for persistent cloud-based storage.

Frontend–Backend Separation — The project uses a dedicated React client and Express server architecture.

Production Deployment — The backend and frontend are configured for deployment through Vercel.

