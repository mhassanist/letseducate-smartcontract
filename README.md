# letseducate-smartcontract


## Sample Usage

```
yarn asb --target release
```


```
near deploy --accountId=letseducate.msaudi.testnet --wasmFile="./build/release/app-one.wasm"
```

```
near call letseducate.msaudi.testnet createLearningRequest '{"title":"test","description":"test","requestedAmount":"1","courseURL":"http://googogl.com"}' --accountId msaudi.testnet
```

```
near view letseducate.msaudi.testnet getAvailableLearningRequests
```

```
near call letseducate.msaudi.testnet supportLearningRequest '{"title":"test"}' --amount 1 --accountId msaudi.testnet
```

