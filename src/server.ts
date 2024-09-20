import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';  
import userRoutes from './routes/userRoutes';
import ratingRoutes from './routes/ratingRoutes';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5500',  // Change this to your frontend URL
  credentials: true  // Enable sending cookies
}));
// app.options('*', cors());  // Enable preflight requests for all routes

app.use(express.json());
app.use(cookieParser());  // Enable cookie parsing

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/rating', ratingRoutes);

// Serve the login/signup page for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the index.html for "/"
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
