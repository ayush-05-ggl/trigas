// server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./setpoints.json";

// Initialize setpoints file if missing
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    targetO2: 5.5,
    targetCO2: 4.1
  }, null, 2));
}

// GET setpoints
app.get("/api/setpoints", (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

// POST to update setpoints
app.post("/api/setpoints", (req, res) => {
  const { targetO2, targetCO2 } = req.body;
  const updated = { targetO2, targetCO2 };
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  res.json({ success: true, data: updated });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
