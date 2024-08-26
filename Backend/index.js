import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import connectToMongoDB from "./db/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cors());


app.use("/api/users", userRoutes);


connectToMongoDB();


app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
