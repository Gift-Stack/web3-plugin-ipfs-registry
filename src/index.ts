import { Contract, validator, Web3PluginBase } from "web3";
import type { types, Web3Context } from "web3";

import { uploadToIPFS } from "./utils/uploadToIPFS";
import { abi, address as contractAddress } from "./registry_interface";
import type { UploadReturnData } from "./utils/types";

export class IPFSRegistryPlugin extends Web3PluginBase {
  public pluginNamespace = "ipfsRegistry";
  private readonly _contract: Contract<typeof abi>;

  public constructor() {
    super();
    this._contract = new Contract(abi, contractAddress, this);
    this._contract.setConfig({ contractDataInputFill: "both" });
  }

  public link(parentContext: Web3Context): void {
    super.link(parentContext);
    this._contract.link(parentContext);
  }

  async upload(filePath: string): Promise<UploadReturnData> {
    try {
      const walletPublicKey = this._contract.wallet![0]?.address;
      if (!walletPublicKey) {
        throw new Error("Please connect a wallet");
      }
      const cid = await uploadToIPFS(filePath);

      const gasEstimate = await this._contract.methods
        .store(cid)
        .estimateGas({ from: walletPublicKey });

      const contractReceipt = await this._contract.methods.store(cid).send({
        gas: String(gasEstimate),
        from: walletPublicKey,
      });

      if (Number(contractReceipt.status) === 1) {
        return { cid, transactionHash: contractReceipt.transactionHash };
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async listCids(address: types.Address): Promise<void> {
    try {
      if (!validator.isAddress(address)) {
        throw new Error(
          `Provided owner address is not a valid address: ${address}`,
        );
      }

      const CIDStored = await this._contract.getPastEvents("CIDStored", {
        filter: { owner: address },
        fromBlock: "4673000",
        toBlock: "latest",
      });
      console.log(CIDStored);
    } catch (error) {
      if ((error as Error).message === "Invalid response") {
        throw new Error(
          "'RPC error' please confirm you rpc provider or use a different one. Usually a result of downtime in the provider",
        );
      }
      throw new Error(error as string);
    }
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    ipfsRegistry: IPFSRegistryPlugin;
  }
}
