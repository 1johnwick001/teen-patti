import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import adminRoute from "./routes/Admin.routes.js";
import userRoute from "./routes/User.routes.js";
import connectDB from "./db/db.connection.js";

dotenv.config({
    path: '../.env'
});

connectDB();

const app = express();

// Middleware
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/api/uploads/photos', express.static(path.join(path.resolve(), 'uploads/photos')));

// CONFIGURING ROUTES
app.use(adminRoute); // routes for admin
app.use(userRoute);  // routes for user

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('HELLOOOOOOO THIsSS IsSSSS SERVERRRRR PAGE');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
