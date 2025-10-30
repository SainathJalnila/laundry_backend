import express from 'express';
import cors from 'cors';
const app = express();
import dotenv from 'dotenv';
import routes from './routes/index.js';
dotenv.config();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});
