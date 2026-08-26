import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  process.stdout.write(`GharDaari API running on ${HOST}:${PORT}\n`);
});
