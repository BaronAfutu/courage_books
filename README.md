# J.P. Alorwu E-commerce Website

## Project Overview
The **J.P. Alorwu E-commerce Website** is a platform designed for selling ebooks authored by Justine Perfect Alorwu. The website provides an intuitive, user-friendly interface for readers to browse, purchase, and read books online. It also includes features such as user authentication, cart management, order tracking, and secure payments through third-party payment integration.

---

## Features
- **User Authentication**: Secure registration, login, and profile management using JWT and bcrypt.
- **Browse and Purchase Ebooks**: Users can browse the ebook catalog, add books to their cart, and complete purchases.
- **Read Online**: Users can access their purchased ebooks and read them directly on the platform.
- **Secure Payments**: Integration with secure payment system to handle payments safely and efficiently.
- **Order Management**: Users can track their orders and view purchase history.
- **Responsive Design**: Built using **Bootstrap 5**, the platform is fully responsive across devices.

---

## Setup Requirements
To set up and run the project locally, the following software is required:

### Prerequisites
1. **Node.js** (v14.x or higher) and **npm** (v6.x or higher)  
   - [Download and install Node.js](https://nodejs.org/en/)
2. **MongoDB** (v4.x or higher)  
   - [Download and install MongoDB](https://www.mongodb.com/try/download/community)
3. **Git** for version control  
   - [Download and install Git](https://git-scm.com/downloads)

### Third-Party Services
- **Stripe**: API for payment integration.
- **NodeMailer**: SMTP configuration for email notifications.

---

## Project Setup

### 1. Clone the Repository
First, clone the project repository to your local machine:
```bash
git clone https://github.com/BaronAfutu/courage_books.git
```

Navigate to the project directory:
```bash
cd courage_books
```

### 2. Install Dependencies
Install the required Node.js packages:
```bash
npm install
```

### 3. Start MongoDB
Ensure that MongoDB is running locally. You can start MongoDB using the following command if MongoDB is installed as a service:
```bash
mongod
```

### 4. Start the Server
To start the development server, run:
```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

---

## Usage

### API Documentation
The API has various endpoints for user authentication, book management, cart operations, and payment processing. You can use **Postman** or another API client to interact with these endpoints. Detailed API documentation [here](https://documenter.getpostman.com/view/30946896/2sAXqwXzPi).

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: Bootstrap 5, jQuery
- **Authentication**: JWT, bcrypt
- **Payments**: Stripe API
- **Emailing**: NodeMailer
- **Version Control**: Git

---

## Contact
For any inquiries, please contact me at [here](mailto:afutubaronny@gmail.com).