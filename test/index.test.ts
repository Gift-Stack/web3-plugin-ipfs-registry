import type { UploadReturnData } from "src/utils/types";
import { Web3, Web3Eth, core } from "web3";
import { IPFSRegistryPlugin } from "../src";

// check what environment test is running on
const isNode =
  typeof process === "object" && process.versions && process.versions.node;

const ganacheTestAddress = "0x09B2Cac235689F1dd172De24D3E13DA684255DAF";
const ganacheTestPrivateKey =
  "0xb80507299831188c729037602e4dc688e659dbb6e75f1b72d098cc6a47b1c58b";

const ganacheNodeRpc = "HTTP://127.0.0.1:7545";

describe("IPFSRegistryPlugin Tests", () => {
  it("should register IPFSRegistryPlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context(ganacheNodeRpc);
    web3Context.registerPlugin(new IPFSRegistryPlugin());
    expect(web3Context.ipfsRegistry).toBeDefined();
  });

  it("should register IPFSRegistryPlugin plugin on Web3Eth instance", () => {
    const web3Eth = new Web3Eth(ganacheNodeRpc);
    web3Eth.registerPlugin(new IPFSRegistryPlugin());
    expect(web3Eth.ipfsRegistry).toBeDefined();
  });

  describe("IPFSRegistryPlugin method tests", () => {
    let consoleSpy: jest.SpiedFunction<typeof global.console.log>;

    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3(ganacheNodeRpc);
      web3.registerPlugin(new IPFSRegistryPlugin());
      consoleSpy = jest.spyOn(global.console, "log");
    });

    it("should call IPFSRegistryPlugin listCids method with expected param", async (): Promise<void> => {
      await web3.ipfsRegistry.listCids(ganacheTestAddress);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith([]);
    });

    describe("IPFSRegistryPlugin upload method test", () => {
      let upload: (filePath: string) => Promise<UploadReturnData>;
      beforeAll(() => {
        const account = web3.eth.accounts.privateKeyToAccount(
          ganacheTestPrivateKey,
        );
        web3.eth.accounts.wallet.add(account);
        upload = isNode
          ? async (file: string) => web3.ipfsRegistry.upload(file)
          : async (file: string) => {
              return await Promise.resolve({
                transactionHash: file,
                cid: file,
              });
            };
      });

      it("should throw an error if the file path is not valid", async () => {
        const filePath = "./invalid-file.txt";

        try {
          await upload(filePath);
          fail("Expected an error but got none.");
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          expect(error.message).toBeDefined();
        }
      });

      it("should upload a file to IPFS and return the CID", async () => {
        const filePath = "src/registry_interface.ts";
        const uploadResult = await upload(filePath);

        expect(uploadResult.cid).toBeDefined();
      });
    });
  });
});
