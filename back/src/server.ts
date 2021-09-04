import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";
dotenv.config();

function main() {
  const app = express();
  const port = process.env.PORT || 4000;

  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());
  app.use("/api", routes);

  app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
  });
}

main();
