import express, { Express, Request, Response } from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';

const app: Express = express();
const PORT: number = 8000;

// Middleware
if (process.env.FRONTEND_URL){
  throw new Error('FRONTEND_URL is not set in .env file');
}
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/api/subjects', subjectsRouter);


// Root GET route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Classroom API!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
