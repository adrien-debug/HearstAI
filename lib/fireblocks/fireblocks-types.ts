/**
 * Types TypeScript pour l'API Fireblocks
 * Documentation: https://developers.fireblocks.com/
 */

// Types de base
export type FireblocksAssetId = 
  | 'USDT' 
  | 'USDC' 
  | 'BTC' 
  | 'ETH' 
  | 'USDT_ERC20' 
  | 'USDT_TRX' 
  | string;

export type TransactionStatus = 
  | 'SUBMITTED' 
  | 'QUEUED' 
  | 'PENDING_SIGNATURE' 
  | 'PENDING_AUTHORIZATION' 
  | 'BROADCASTING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REJECTED' 
  | 'BLOCKED';

export type TransactionSubStatus = 
  | 'CONFIRMED' 
  | 'PARTIALLY_COMPLETED' 
  | 'PENDING_AML_SCREENING' 
  | 'INSUFFICIENT_FUNDS' 
  | 'INSUFFICIENT_FUNDS_FOR_FEE';

export type SourceType = 'VAULT_ACCOUNT' | 'EXTERNAL_WALLET' | 'EXCHANGE_ACCOUNT';
export type DestinationType = 'VAULT_ACCOUNT' | 'EXTERNAL_WALLET' | 'EXCHANGE_ACCOUNT' | 'UNMANAGED_WALLET' | 'INTERNAL_WALLET' | 'NETWORK_CONNECTION';

// Configuration Fireblocks
export interface FireblocksConfig {
  apiKey: string;
  privateKey: string;
  baseUrl?: string;
  timeout?: number;
}

// Adresses source/destination
export interface TransactionSource {
  type: SourceType;
  id?: string;
  name?: string;
  oneTimeAddress?: {
    address: string;
    tag?: string;
  };
}

export interface TransactionDestination {
  type: DestinationType;
  id?: string;
  name?: string;
  oneTimeAddress?: {
    address: string;
    tag?: string;
  };
  amount?: string;
}

// Transaction
export interface TransactionRequest {
  assetId: FireblocksAssetId;
  source: TransactionSource;
  destination: TransactionDestination;
  amount: string;
  fee?: string;
  feeLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  priorityFee?: string;
  gasPrice?: string;
  gasLimit?: string;
  networkFee?: string;
  replaceTxByHash?: string;
  note?: string;
  operation?: 'TRANSFER' | 'MINT' | 'BURN' | 'SUPPLY' | 'REDEEM' | 'STAKE' | 'UNSTAKE';
  customerRefId?: string;
  extraParameters?: Record<string, any>;
  treatAsGrossAmount?: boolean;
  forceSweep?: boolean;
  maxFee?: string;
  failOnLowFee?: boolean;
}

export interface TransactionResponse {
  id: string;
  status: TransactionStatus;
  subStatus?: TransactionSubStatus;
  assetId: FireblocksAssetId;
  source: TransactionSource;
  destination: TransactionDestination;
  amount: number;
  netAmount?: number;
  amountUSD?: number;
  serviceFee?: number;
  networkFee?: number;
  createdAt: number;
  lastUpdated: number;
  index?: number;
  txHash?: string;
  signedBy: string[];
  createdBy: string;
  rejectedBy?: string;
  note?: string;
  exchangeTxId?: string;
  requestedAmount?: number;
  feeCurrency?: FireblocksAssetId;
  fee?: number;
  destinations?: TransactionDestination[];
  signedMessages?: Array<{
    content: string;
    algorithm: string;
    derivationPath: number[];
    signature: {
      fullSig: string;
      r?: string;
      s?: string;
      v?: number;
    };
    publicKey: string;
  }>;
  extraParameters?: Record<string, any>;
  amlScreeningResult?: {
    provider?: string;
    payload?: string;
  };
  customerRefId?: string;
  numOfConfirmations?: number;
  networkRecords?: Array<{
    source: TransactionSource;
    destination: TransactionDestination;
    txHash: string;
    networkFee: number;
    assetId: FireblocksAssetId;
    netAmount: number;
    status: TransactionStatus;
    type: string;
    destinationAddress: string;
    sourceAddress: string;
    amountUSD: number;
    index: number;
  }>;
  replacedTxHash?: string;
  externalTxId?: string;
}

// Vault Account
export interface VaultAccount {
  id: string;
  name: string;
  hiddenOnUI?: boolean;
  assets: AssetResponse[];
  customerRefId?: string;
  autoFuel?: boolean;
}

export interface AssetResponse {
  id: FireblocksAssetId;
  total: string;
  available: string;
  pending: string;
  frozen?: string;
  lockedAmount?: string;
  staked?: string;
  blockHeight?: string;
  blockHash?: string;
}

// Vault Account Asset
export interface VaultAccountAssetAddress {
  address: string;
  tag?: string;
  legacyAddress?: string;
  enterpriseAddress?: string;
}

export interface VaultAccountAsset {
  id: FireblocksAssetId;
  total: string;
  available: string;
  pending: string;
  frozen?: string;
  lockedAmount?: string;
  staked?: string;
  blockHeight?: string;
  blockHash?: string;
  address?: VaultAccountAssetAddress;
}

// External Wallet
export interface ExternalWalletAsset {
  id: FireblocksAssetId;
  status: string;
  address: string;
  tag?: string;
  activationTime?: number;
}

export interface ExternalWallet {
  id: string;
  name: string;
  customerRefId?: string;
  assets: ExternalWalletAsset[];
}

// Error Response
export interface FireblocksError {
  message: string;
  code?: string;
}

// Rate Limit Info
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

