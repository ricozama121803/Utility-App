import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import assetRoutes from "./routes/asset";
import authRoutes from "./routes/auth";
import autofillRoutes from "./routes/autofill";
import brandTemplateRoutes from "./routes/brand-template";
import designRoutes from "./routes/design";
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import returnNavRoutes from "./routes/return-nav";
import exportRoutes from "./routes/export";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../common/backend/middleware/errors";
import type { client } from "@hey-api/client-fetch";
import { logger } from "../../common/backend/middleware/logger";
import { getToken } from "../../common/backend/database/queries";
import { AUTH_COOKIE_NAME } from "../../common/backend/services/auth";
import { db } from "./database/database";

declare global {
  namespace Express {
    interface Request {
      client: typeof client;
      token: string;
      session: {
        refresh_token?: string;
      };
    }
  }
}

const port = process.env.BACKEND_PORT;

if (!port) {
  throw new Error("'BACKEND_PORT' env variable not found.");
}

const saveTokensToFile = (tokens: { access_token: string, refresh_token: string }) => {
  try {
    const filePath = path.join(__dirname, 'canva-tokens.json');
    console.log('Attempting to save tokens to:', filePath);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
    console.log('Successfully saved tokens to file');
    console.log('Current directory:', __dirname);
  } catch (error) {
    console.log('Error saving tokens:', error);
  }
};



const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser(process.env.DATABASE_ENCRYPTION_KEY));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(errorHandler);
app.use(logger);

// Add token-info endpoint
app.get('/token-info', async (req, res) => {
  const auth = req.signedCookies[AUTH_COOKIE_NAME];
  try {
    const token = await getToken(auth, db);
    if (token?.access_token && token?.refresh_token) {
      const tokens = {
        access_token: token.access_token,
        refresh_token: token.refresh_token
      };
      
      // Save to JSON file
      saveTokensToFile(tokens);
      
      // Send response to UI
      res.json(tokens);
    } else {
      res.json({});
    }
  } catch (error) {
    res.json({});
  }
});


// Add this route before app.listen
app.get('/api/tokens', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const filePath = path.join(__dirname, 'canva-tokens.json');
    const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tokens' });
  }
});


// Mount routes
app.use(authRoutes);
app.use(assetRoutes);
app.use(autofillRoutes);
app.use(designRoutes);
app.use(brandTemplateRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(returnNavRoutes);
app.use(exportRoutes);

app.set(
  "views",
  path.join(__dirname, "..", "..", "common", "backend", "views"),
);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Ecommerce shop backend listening on port ${port}`);
});
