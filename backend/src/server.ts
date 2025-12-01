import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config(); 

const startServer = async () => {
  try {
    await connectDB();
    
    
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || "0.0.0.0";
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${HOST}: ${PORT}`);
    });
    
    
  } catch (error) {
    console.error("❌ Failed to start server:", (error as Error).message);
    process.exit(1);
  }
};

// Start the server
startServer();
