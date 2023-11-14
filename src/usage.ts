import { HttpProvider, Web3 } from "web3";
import dotenv from "dotenv";
import type { UploadReturnData } from "./utils/types";
import { IPFSRegistryPlugin } from "./index";

dotenv.config();

const provider = new HttpProvider(
  "https://endpoints.omniatech.io/v1/eth/sepolia/public",
);
// const provider = new HttpProvider("HTTP://127.0.0.1:7545"); // Provider for Ganache environment
const web3 = new Web3(provider);

web3.registerPlugin(new IPFSRegistryPlugin());

const privateKey = process.env.PRIVATE_KEY as string; // Should be replaced with one's privateKey (Or connect wallet in a client environment)
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

export const _upload = async (): Promise<UploadReturnData> => {
  return await web3.ipfsRegistry.upload("src/usage.ts");
};

export const getCids = async (): Promise<void> => {
  await web3.ipfsRegistry.listCids(
    "0x8B90d90F2867D52878483B42bcA591F9Efe2931b",
  );
};

void _upload().then((data) => console.log("Uploaded", data));
void getCids().then();
