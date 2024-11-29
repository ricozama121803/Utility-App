import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const router = express.Router();

router.get("/api/tokens-file", cors(), (req, res) => {
    try {
      const filePath = path.join(__dirname, '..', 'canva-tokens.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.send(fileContent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve tokens file' });
    }
});

router.get('/api/tokens', cors(), (req, res) => {
    try {
      const filePath = path.join(__dirname, '..', 'canva-tokens.json');
      const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve tokens' });
    }
});

router.get("/api/test", cors(), (req, res) => {
    console.log("Test route hit!");
    console.log("Headers:", req.headers);
    res.json({ message: "Test successful" });
});

export default router;
