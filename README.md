web3-plugin-ipfs-registry
===========

This is a plugin for uploading files into ipfs, and registering them in a smart contract, built with web3.js v4 plugin.

How to use
------------

1. Instantiate  `web3`
```javascript
const provider = new HttpProvider(
  "https://ethereum-sepolia.publicnode.com",
);
// const provider = new HttpProvider("HTTP://127.0.0.1:7545"); // Provider for Ganache environment
const web3 = new Web3(provider);
```
Here are a list of supported RPCs:
```javascript
["https://ethereum-sepolia.publicnode.com", "https://endpoints.omniatech.io/v1/eth/sepolia/public", "https://rpc.sepolia.org", "https://sepolia.gateway.tenderly.co"]
```
There are more rpcs [here](https://chainlist.org/chain/11155111)

2. Register plugin for use
```javascript
web3.registerPlugin(new IPFSRegistryPlugin());
```

3. Call the upload function
```javascript
export const _upload = async (): Promise<UploadReturnData> => {
  return await web3.ipfsRegistry.upload("src/usage.ts");
};
```

4. Fetch uploaded CIDs
```javascript
export const getCids = async (): Promise<void> => {
  await web3.ipfsRegistry.listCids(
    "0x8B90d90F2867D52878483B42bcA591F9Efe2931b",
  );
};

```

5. Run test (This runs the E2E test on both node and browser environment)
```sql
yarn run test:all
```

7. Run build.
```sql
yarn run build
```

Contributing
------------

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

License
-------

[MIT](https://choosealicense.com/licenses/mit/)
