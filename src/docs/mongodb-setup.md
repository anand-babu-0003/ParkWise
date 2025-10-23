# MongoDB Atlas Connection Setup

## Issue Description

You're encountering this error:
```
{"error":"Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."}
```

This occurs because MongoDB Atlas has security measures that restrict database access to specific IP addresses.

## Solution Options

### Option 1: Whitelist Your IP Address (Recommended for Production)

1. Go to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Select your cluster
3. Navigate to the "Network Access" section in the left sidebar
4. Click "Add IP Address"
5. You can either:
   - Click "Add Current IP Address" to automatically detect and add your current IP
   - Enter a specific IP address
   - For development only, you can enter `0.0.0.0/0` to allow access from anywhere (NOT recommended for production)

### Option 2: Use Environment Variables

Create a `.env.local` file in your project root with your MongoDB connection string:

```env
MONGO_URI=your_actual_mongodb_connection_string_here
```

Make sure to replace `your_actual_mongodb_connection_string_here` with your actual MongoDB connection string from Atlas.

### Option 3: Test Database Connection

You can test your database connection using the script we've created:

```bash
npm run test:db
```

This will provide detailed information about any connection issues and troubleshooting steps.

## Connection String Format

Your MongoDB connection string should look like this:
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

## Common Issues and Solutions

1. **IP Not Whitelisted**: Add your IP to the Atlas whitelist
2. **Incorrect Credentials**: Verify your username and password
3. **Network Issues**: Check your internet connection
4. **Firewall Blocking**: Ensure your firewall isn't blocking the connection

## Security Best Practices

1. Never commit your MongoDB connection string to version control
2. Use environment variables for sensitive data
3. Limit IP whitelist to only necessary addresses
4. Regularly rotate your database credentials