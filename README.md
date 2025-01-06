# xian-js

JavaScript/TypeScript SDK for interacting with the Xian blockchain network. This library provides comprehensive tools for wallet management, transaction handling, and smart contract interactions.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
  - [Wallet Management](#wallet-management)
  - [Transaction Management](#transaction-management)
  - [Network Interactions](#network-interactions)
  - [Smart Contract Operations](#smart-contract-operations)
  - [Blockchain Queries](#blockchain-queries)

## Installation

```bash
npm install xian-js
```

## Features

- Basic and HD wallet creation using BIP39/BIP32 standards
- Secure keystore functionality for encrypted key storage
- Transaction creation, simulation, and broadcasting
- Support for both synchronous and asynchronous transaction submission
- Smart contract deployment and interaction
- Comprehensive blockchain querying capabilities
- Network status monitoring and management
- Advanced data encoding utilities for blockchain-specific types
- Custom BigNumber handling for precise decimal operations
- Message signing and verification utilities
- Event emitting system for real-time updates
- TypeScript support with full type definitions

## Quick Start

```typescript
import { TransactionBuilder, Wallet } from "xian-js";

// Create a new wallet
const wallet = Wallet.create_wallet();
console.log(`Public Key: ${wallet.vk}`);

// Set up network information
const network_info = {
    chain_id: "xian-testnet-1",
    masternode_hosts: ["https://testnet.xian.org"]
};

// Create and send a transaction
const tx_info = {
    senderVk: wallet.vk,
    chain_id: network_info.chain_id,
    contractName: "currency",
    methodName: "transfer",
    kwargs: {
        to: "recipient_address",
        amount: 100
    },
    stampLimit: 50000
};

const transaction = new TransactionBuilder(network_info, tx_info);
const result = await transaction.send(wallet.sk);
```

## Usage Guide

### Wallet Management

#### Creating Wallets

```typescript
import { Wallet } from "xian-js";

// Create a new wallet
const newWallet = Wallet.create_wallet();

// Create from existing private key
const existingWallet = Wallet.create_wallet({
    sk: "your_private_key_here"
});

// Create BIP39 HD wallet
const hdWallet = Wallet.new_wallet_bip39();
console.log(`Mnemonic: ${hdWallet.mnemonic}`);
```

#### Message Signing and Verification

```typescript
// Sign a message
const message = Buffer.from('Hello Xian');
const signature = wallet.sign(wallet.sk, message);

// Verify signature
const isValid = wallet.verify(wallet.vk, message, signature);
```

### Transaction Management

#### Basic Transaction

```typescript
const tx_info = {
    senderVk: wallet.vk,
    chain_id: network_info.chain_id,
    contractName: "currency",
    methodName: "transfer",
    kwargs: {
        to: "recipient_address",
        amount: 100
    }
};

const transaction = new TransactionBuilder(network_info, tx_info);
const result = await transaction.send(wallet.sk);
```

#### Transaction Simulation

```typescript
// Simulate transaction to estimate stamps
const simulation = await transaction.simulate_txn(wallet.sk);
console.log(`Estimated stamps: ${simulation.stamps_used}`);
```

### Keystore Management

The SDK provides secure key storage functionality:

```typescript
import { Keystore } from "xian-js";

// Create a new keystore
const keystore = new Keystore();

// Add keys with metadata
keystore.addKey({
    sk: "private_key_here",
    nickname: "Main Wallet",
    name: "Trading Account",
    network: "testnet"
});

// Encrypt keystore with password
const encrypted = keystore.createKeystore("your_password", "optional_hint");

// Load encrypted keystore
const loadedKeystore = new Keystore({ keystoreData: encrypted });
loadedKeystore.decryptKeystore("your_password");

// Access wallets
const wallets = loadedKeystore.wallets;
```

### Data Encoding

The SDK includes utilities for handling blockchain-specific data types:

```typescript
import { Encoder } from "xian-js";

// Handle blockchain numbers with precision
const amount = Encoder("bigNumber", "123.456789");

// Encode various data types
const intValue = Encoder("int", 123);
const floatValue = Encoder("float", 123.456);
const dateValue = Encoder("datetime", new Date());
const listValue = Encoder("list", [1, 2, 3]);
```

### Network Interactions

```typescript
import { Network } from "xian-js";

const network = new Network({
    chain_id: "xian-testnet-1",
    masternode_hosts: ["https://testnet.xian.org"]
});

// Check network status
const isOnline = await network.ping();

// Get latest block
const latestBlock = await network.getLastetBlock();
```

### Smart Contract Operations

```typescript
import { MasternodeAPI } from "xian-js";

const api = new MasternodeAPI(network_info);

// Get contract info
const contractInfo = await api.getContractInfo("currency");

// Get contract methods
const methods = await api.getContractMethods("currency");

// Query contract state
const state = await api.getVariable("currency", "balances", address);
```

### Blockchain Queries

```typescript
// Get account balance
const balance = await api.getCurrencyBalance(address);

// Get transaction details
const tx = await api.getTxResult(txHash);

// Get contract variables
const variables = await api.getContractVariables("currency");
```

## Events System

The SDK includes an event emitter system for real-time updates:

```typescript
network.events.on("online", (status) => {
    console.log(`Network status changed: ${status}`);
});
```
