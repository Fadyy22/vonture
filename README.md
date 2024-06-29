# Job Search API

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)

### Installation

1. Clone the repo
   `git clone https://github.com/Fadyy22/vonture.git`
2. Navigate to the project directory
   `cd vonture`
3. Install dependencies
   `npm install`
4. Create a `.env` file in the root directory and add the following environment variables:
   `Contact for the .env file or create your own and add the following:`

   ```env
   # SERVER

   HOST=
   PORT=

   # DATABASE

   DATABASE_URL=
   DIRECT_URL=

   # JWT

   JWT_SECRET_KEY=
   JWT_EXPIRATION=

   # STRIPE

   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_KEY=

   # CLOUDINARY

   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # EMAIL

   EMAIL_SERVICE=
   EMAIL_HOST=
   EMAIL_PORT=
   EMAIL_USER=
   EMAIL_PASSWORD=
   ```

5. Start the server
   `npm start`
