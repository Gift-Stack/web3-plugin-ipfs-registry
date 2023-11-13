import fs from "fs";

import { ThirdwebStorage } from "@thirdweb-dev/storage";

export const uploadToIPFS = async (file: string): Promise<string> => {
  const storage = new ThirdwebStorage({
    secretKey:
      "iLl0ufZKITKF77kviHO5ZtZJuUNRziuzaIa8hX6_nv9Ou-9mwoc9LMAx7IQWfXeZlBpGLIx7HwpSoEPKH9z52A",
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
