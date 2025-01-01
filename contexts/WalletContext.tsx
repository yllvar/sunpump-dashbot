"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import tronWeb from '@/lib/tronweb';
import { toast } from 'react-hot-toast';
import { SUNPUMP_CONTRACT_ADDRESS } from '@/lib/constants';
import { log } from '@/lib/logger';

interface TokenBalance {
  symbol: string;
  balance: string;
  address: string;
}

interface WalletContextType {
  address: string;
  balance: string;
  tokenBalances: TokenBalance[];
  walletLabel: string;
  showFeedback: (message: string, type: 'success' | 'error') => void;
  generateWallet: () => Promise<void>;
  getBalance: (address: string) => Promise<string>;
  createToken: (params: TokenCreationParams) => Promise<any>;
  launchToken: (params: LaunchParams) => Promise<any>;
  provideLiquidity: (params: LaunchParams) => Promise<any>;
  getTokenBalances: () => Promise<void>;
  getDetailedWalletInfo: () => Promise<any>;
  labelWallet: (label: string) => void;
  setState: React.Dispatch<React.SetStateAction<{
    address: string;
    balance: string;
    tokenBalances: TokenBalance[];
    walletLabel: string;
  }>>;
}

interface TokenCreationParams {
  name: string;
  symbol: string;
  initialLiquidity: number;
}

interface LaunchParams {
  tokenAddress: string;
  trxAmount: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState = {
    address: '',
    balance: '0',
    tokenBalances: [] as TokenBalance[],
    walletLabel: '',
  };

  const [state, setState] = useState(initialState);
  const { address, balance, tokenBalances, walletLabel } = state;

  const showFeedback = (message: string, type: 'success' | 'error') => {
    log.info('Showing feedback', { message, type });
    toast[type](message);
  };

  const generateWallet = async () => {
    log.info('Attempting to generate a new wallet');
    try {
      const account = await tronWeb.createAccount();
      if (!account || !account.address || !account.address.base58) {
        throw new Error('Failed to create account');
      }
      log.info('Wallet generated successfully', { address: account.address.base58 });
      setState(prev => ({
        ...prev,
        address: account.address.base58,
      }));
      await getBalance(account.address.base58);
      await getTokenBalances();
      showFeedback('Wallet generated successfully', 'success');
    } catch (error) {
      log.error('Failed to generate wallet', { error: error.message });
      showFeedback('Failed to generate wallet. Please try again.', 'error');
      throw error;
    }
  };

  const getBalance = async (address: string): Promise<string> => {
    try {
      const balance = await tronWeb.trx.getBalance(address);
      const formattedBalance = tronWeb.fromSun(balance);
      setState(prev => ({ ...prev, balance: formattedBalance }));
      return formattedBalance;
    } catch (error) {
      log.error('Failed to get balance', { error: error.message });
      showFeedback('Failed to get balance. Please try again.', 'error');
      throw error;
    }
  };

  const getTokenBalances = async () => {
    if (!address) {
      setState(prev => ({ ...prev, tokenBalances: [] }));
      return;
    }
    try {
      const tokens = await tronWeb.trx.getAccount(address);
      const tokenBalances: TokenBalance[] = tokens?.assetV2?.map((token: any) => ({
        symbol: token.key,
        balance: token.value.toString(),
        address: token.name
      })) || [];
      setState(prev => ({ ...prev, tokenBalances }));
    } catch (error) {
      console.error('Error fetching token balances:', error);
      showFeedback('Failed to fetch token balances. Please try again.', 'error');
      setState(prev => ({ ...prev, tokenBalances: [] }));
    }
  };

  const createToken = async (params: TokenCreationParams) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      const contract = await tronWeb.contract().at(SUNPUMP_CONTRACT_ADDRESS);
      
      const amountInSun = tronWeb.toSun(params.initialLiquidity);
      
      const result = await contract.createAndInitPurchase(
        params.name,
        params.symbol
      ).send({
        callValue: amountInSun,
        feeLimit: 100_000_000,
      });

      showFeedback('Token created successfully!', 'success');
      return result;
    } catch (error) {
      console.error('Token creation failed:', error);
      showFeedback(`Token creation failed: ${error.message}`, 'error');
      throw error;
    }
  };

  const launchToken = async (params: LaunchParams) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      const contract = await tronWeb.contract().at(SUNPUMP_CONTRACT_ADDRESS);
      
      const result = await contract.launchToDEX(params.tokenAddress).send({
        feeLimit: 100_000_000,
      });

      showFeedback('Token launched successfully!', 'success');
      return result;
    } catch (error) {
      console.error('Token launch failed:', error);
      showFeedback(`Token launch failed: ${error.message}`, 'error');
      throw error;
    }
  };

  const provideLiquidity = async (params: LaunchParams) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      const contract = await tronWeb.contract().at(SUNPUMP_CONTRACT_ADDRESS);
      
      const amountInSun = tronWeb.toSun(params.trxAmount);
      
      const result = await contract.purchaseToken(
        params.tokenAddress,
        0
      ).send({
        callValue: amountInSun,
        feeLimit: 100_000_000,
      });

      showFeedback('Liquidity provided successfully!', 'success');
      return result;
    } catch (error) {
      console.error('Liquidity provision failed:', error);
      showFeedback(`Liquidity provision failed: ${error.message}`, 'error');
      throw error;
    }
  };

  const getDetailedWalletInfo = async () => {
    // Implement this function based on your requirements
    // For now, we'll return a placeholder
    return {
      tokens: tokenBalances,
      totalPortfolioValueUsd: '0' // You should calculate this based on token balances and their prices
    };
  };

  const labelWallet = (label: string) => {
    setState(prev => ({ ...prev, walletLabel: label }));
  };

  return (
    <WalletContext.Provider value={{
      address,
      balance,
      tokenBalances,
      walletLabel,
      showFeedback,
      generateWallet,
      getBalance,
      createToken,
      launchToken,
      provideLiquidity,
      getTokenBalances,
      getDetailedWalletInfo,
      labelWallet,
      setState
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

