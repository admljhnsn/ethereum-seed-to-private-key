# Ethereum Key Generator

A simple utility to derive Ethereum private keys, public keys, and addresses from a hex seed.

## Installation

```bash
# Clone or download this repository, then:
npm install
```

## Usage

### Interactive Mode
```bash
npm start
```

### Command Line Mode
```bash
node index.js --seed 0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266
```

## Example Seeds
- 32-byte seed: `0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266`
- 64-byte seed: `0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe2664c1a8a2c16c6c31400bcbab9bbe6b313986a61a43e9d2232d95d6aa335d319e8`

## Features
- Supports both 32-byte (64 hex chars) and 64-byte (128 hex chars) seeds
- 64-byte seeds are hashed with SHA-256 to create a valid private key
- Compatible with ethers.js v5 and v6
- Can be used interactively or via command line
