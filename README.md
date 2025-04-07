# Telegram Shop

A Telegram Mini App for a shop with product management capabilities.

## Features

- Frontend built with React and Tailwind CSS
- Admin panel for product management
- JSON file storage on the backend
- Telegram integration for user authentication and image uploads
- Responsive design optimized for Telegram Mini App

## Installation

### Backend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   BOT_TOKEN=your_telegram_bot_token
   ```
4. Start the server:
   ```
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Telegram Bot Setup

The project includes a Telegram bot for handling image uploads. This allows admins to upload product images directly to Telegram and use the provided URLs for product images.

1. Create a new bot using [@BotFather](https://t.me/BotFather) on Telegram
2. Get your bot token and add it to the `.env` file
3. Run the Telegram bot separately:
   ```
   node telegram-bot.js
   ```
4. Send images to your bot, and it will return URLs that can be used for products

## Admin Access

By default, the system uses a predefined list of Telegram user IDs for admin access. To add yourself as an admin:

1. Find your Telegram user ID (you can use [@userinfobot](https://t.me/userinfobot))
2. Add your ID to the `ADMIN_IDS` array in `server.js`

## Project Structure

- `server.js` - Express server with JSON file storage
- `telegram-bot.js` - Telegram bot for image uploads
- `data/` - Directory containing JSON files for persistent storage
  - `menu.json` - Product data
  - `orders.json` - Order data
  - `uploads.json` - Image upload records
- `frontend/` - React frontend application

## Product Management

The admin panel allows you to:

1. View all products
2. Add new products
3. Edit existing products
4. Delete products

Product images can be uploaded in two ways:
- Direct URL input
- Upload to the Telegram bot, which provides a URL

## Data Storage

All data is stored in JSON files:

- Products are stored in `data/menu.json`
- Orders are stored in `data/orders.json`
- Image upload records are stored in `data/uploads.json`

This provides a simple, persistent storage solution without requiring a database.

## License

MIT
