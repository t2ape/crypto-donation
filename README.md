# Crypto Donation
Crypto Donation は、暗号通貨を使って簡単に寄付ができるサービスです。

# 利用方法
## 寄付の手順
1. 寄付リストからご希望の寄付先を選ぶ。
  <img width="800" alt="image" src="https://github.com/t2ape/crypto-donation/assets/35091675/51a34b04-6039-461f-b7aa-105a4096bb9f">

2. 寄付金額を指定する。
  <img width="800" alt="image" src="https://github.com/t2ape/crypto-donation/assets/35091675/775ec254-b7a0-4b73-9889-8010d6340ea8">

3. 最終的な金額 (寄付金額＋ガス代) を確認した上で寄付を行う。
  <img width="800" alt="image" src="https://github.com/t2ape/crypto-donation/assets/35091675/8bb63965-6785-4c2a-997d-a96a3b3a5f2e">

## 寄付に関する安全上の注意
- 暗号通貨ウォレットで寄付する場合、Metamask などのウォレットに表示される内容が、意図する取引内容になっているか確認してください。 
- これは取引の安全を確保するための重要なステップです。

## 特別な報酬: NFT の発行
- 一定の基準以上の金額を寄付していただくと、報酬としてユニークな NFT を発行します。
- この NFT 発行に必要な寄付金額は、寄付の詳細ページでご確認いただけます。 
- また、発行された NFT は、OpenSea などの NFT マーケットプレイスで取引や検証が可能です。
  <img width="800" alt="image" src="https://github.com/t2ape/crypto-donation/assets/35091675/709b142f-c10d-449d-a4dd-be90b28ed5c6">

## NFT の特徴
- Crypto Donation で発行される NFT はジェネラティブにデザインされたフルオンチェーンな NFT です。
- そのため特定の第三者機関によらず、ブロックチェーン上で半永久的に NFT にアクセスすることができます。

# 開発
## フロントエンド
- React を用いて開発しています。
- 以下の手順でサーバーを立ち上げてください。
```sh
$ cd client
$ npm start
```

## スマートコントラクト
- Solidity + Truffle を用いて開発しています。
- Ganache などをインストールし、以下の設定でローカル環境にブロックチェーンネットワークを立ち上げてください。
```
hostname: 127.0.0.1
port number: 8545
network id: 1337
```
