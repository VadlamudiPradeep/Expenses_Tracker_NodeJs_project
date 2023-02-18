import express from 'express';
import bodyparser from 'body-parser';

import toRoutes from './routes/todos';

let app = express();

app.use(bodyparser.json());

app.use(toRoutes);

app.listen(3000);