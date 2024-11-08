import express from 'express';
import { signIn } from './functions/signIn';
import { signUp } from './functions/signUp';
import { lab_register } from './functions/lab_register';


import { errorHandler, notFound } from './middleware/errorHandler';


const app = express();
app.use(express.json());

// auth
app.post('/api/auth/signup', signUp);
app.post('/api/auth/signin', signIn);

// lab
app.post('/api/lab/register', lab_register);

// error handler
app.use(notFound);
app.use(errorHandler);

app.listen('5000', () => console.log(`Listen API Server PORT 5000`));
