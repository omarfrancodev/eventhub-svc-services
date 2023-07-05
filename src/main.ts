import express from "express";
import { serviceRouter } from "./services/infrastructure/ServiceRouter";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/services", serviceRouter);
app.get("/images-services/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "images-services", filename);
  res.sendFile(imagePath);
});

const port = parseInt(process.env.SERVER_PORT ?? "3000");

app.listen(port, () => {
  console.log('[Application] Server online in port ' + port)
});
