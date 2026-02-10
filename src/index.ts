import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT: number = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root GET route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Classroom API!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
