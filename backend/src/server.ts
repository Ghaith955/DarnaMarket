import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API sur http://localhost:${port}`));
  })
  .catch((err) => console.error('Erreur MongoDB :', err));