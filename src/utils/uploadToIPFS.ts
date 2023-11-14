import fs from "fs";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import dotenv from "dotenv";

dotenv.config();

export const uploadToIPFS = async (file: string): Promise<string> => {
  const storage = new ThirdwebStorage({
    secretKey: process.env.THIRD_WEB_SECRET_KEY,
  });
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(file);
    const upload = await storage.upload(fileBuffer);

    return upload;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};
