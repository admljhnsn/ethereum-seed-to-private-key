#!/usr/bin/env node

/**
 * Ethereum Key Generator
 * Generate Ethereum keys from a hex seed
 */

const { ethers } = require('ethers');
const crypto = require('crypto');
const readline = require('readline');
const chalk = require('chalk');

// Parse command line arguments
const args = process.argv.slice(2);
let seedFromArgs = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--seed' && i + 1 < args.length) {
    seedFromArgs = args[i + 1];
    break;
  }
}

// Create interface for user input if needed
let rl;
if (!seedFromArgs) {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Converts a raw seed (starting with 0x) to an Ethereum private key
 * Works with both 32-byte (64 hex chars) and 64-byte (128 hex chars) seeds
 */
async function main() {
  try {
    // Get seed from command line or user
    let rawSeed;
    
    if (seedFromArgs) {
      rawSeed = seedFromArgs;
    } else {
      console.log(chalk.cyan('=== Ethereum Key Generator ==='));
      console.log(chalk.gray('Generate Ethereum keys from a hex seed\n'));
      
      rawSeed = await askQuestion('Enter your seed (starting with 0x): ');
    }
    
    if (!rawSeed || !rawSeed.startsWith('0x')) {
      throw new Error('Seed must start with 0x');
    }
    
    // Remove 0x prefix
    const seedWithoutPrefix = rawSeed.slice(2);
    
    // Validate seed format
    if (!/^[0-9a-fA-F]+$/.test(seedWithoutPrefix)) {
      throw new Error('Seed must be valid hexadecimal');
    }
    
    // Detect seed length
    const seedLength = seedWithoutPrefix.length;
    console.log(chalk.gray(`Detected seed length: ${seedLength} characters (${seedLength/2} bytes)`));
    
    if (seedLength < 64) {
      throw new Error('Seed too short! Must be at least 32 bytes (64 hex chars) after 0x prefix');
    }
    
    // Process seed based on length
    let privateKeyHex;
    
    if (seedLength >= 128) {
      // For 64-byte seeds, hash with SHA-256
      console.log(chalk.yellow('Processing 64-byte seed with SHA-256...'));
      privateKeyHex = crypto.createHash('sha256').update(Buffer.from(seedWithoutPrefix, 'hex')).digest('hex');
    } else {
      // For 32-byte seeds, use directly
      console.log(chalk.yellow('Using 32-byte seed directly...'));
      privateKeyHex = seedWithoutPrefix.slice(0, 64);
    }
    
    const privateKey = `0x${privateKeyHex}`;
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    
    // Try to get public key (works differently in ethers v5 vs v6)
    let publicKey;
    try {
      // ethers v6 approach
      publicKey = wallet.signingKey.publicKey;
    } catch (error) {
      try {
        // ethers v5 approach
        publicKey = ethers.utils.computePublicKey(privateKey, false);
      } catch (e) {
        publicKey = chalk.gray('Could not determine (ethers version incompatible)');
      }
    }
    
    // Output results
    console.log(chalk.green('\n===== DERIVED KEYS ====='));
    console.log(chalk.cyan('Private Key:'), chalk.yellow(wallet.privateKey));
    console.log(chalk.cyan('Public Key: '), chalk.yellow(publicKey));
    console.log(chalk.cyan('Address:    '), chalk.yellow(wallet.address));
    
    // Add warning for example keys
    const exampleKey1 = '0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266';
    const exampleKey2 = '0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe2664c1a8a2c16c6c31400bcbab9bbe6b313986a61a43e9d2232d95d6aa335d319e8';
    
    if (rawSeed === exampleKey1 || rawSeed === exampleKey2) {
      console.log(chalk.red('\nWARNING: You used an example key. Never use this for real assets!'));
    }
    
  } catch (error) {
    console.error(chalk.red('\nERROR:'), error.message);
  } finally {
    if (rl) rl.close();
  }
}

// Helper function to get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(chalk.cyan(question), (answer) => {
      resolve(answer);
    });
  });
}

// Run the program
main();
