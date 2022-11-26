import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3333, () => console.log(`App running on PORT: 3333`));

export default app;
