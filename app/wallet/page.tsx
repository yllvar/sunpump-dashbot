"use client"

import DashboardLayout from '@/components/DashboardLayout'
import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { ErrorBoundary } from 'react-error-boundary'
import { log } from '@/lib/logger'

const ErrorFallback = ({ error }: { error: Error }) => {
  log.error('Error in Wallet page', { error: error.message });
  return (
    <div className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

export default function WalletPage() {
  const { 
    address, 
    generateWallet, 
    getDetailedWalletInfo, 
    showFeedback, 
    labelWallet, 
    getBalance,
    walletLabel 
  } = useWallet()
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [newLabel, setNewLabel] = useState('')
  const [actualBalance, setActualBalance] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (address) {
      fetchWalletInfo();
      fetchActualBalance();
    }
  }, [address])

  const fetchWalletInfo = async () => {
    try {
      const info = await getDetailedWalletInfo();
      setWalletInfo(info);
      showFeedback('Wallet info updated successfully', 'success');
    } catch (error) {
      log.error("Failed to get wallet info", { error: error.message });
      showFeedback('Failed to fetch wallet info. Please try again.', 'error');
    }
  }

  const fetchActualBalance = async () => {
    try {
      if (address) {
        const balance = await getBalance(address);
        setActualBalance(balance);
      }
    } catch (error) {
      log.error("Failed to fetch actual balance", { error: error.message });
      showFeedback('Failed to fetch balance. Please try again.', 'error');
    }
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLabel(e.target.value);
  }

  const handleLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    labelWallet(newLabel);
    setNewLabel('');
    showFeedback('Wallet label updated successfully', 'success');
  }

  const handleGenerateWallet = async () => {
    setIsLoading(true);
    try {
      log.info('Generate wallet button clicked');
      await generateWallet();
      log.info('Wallet generated successfully');
      showFeedback('Wallet generated successfully', 'success');
    } catch (error) {
      log.error('Failed to generate wallet', { error: error.message });
      showFeedback('Failed to generate wallet. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Card>
          <CardHeader>
            <CardTitle>TRON Wallet</CardTitle>
            <CardDescription>Manage your TRON wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleGenerateWallet} disabled={isLoading}>
                {isLoading ? "Generating..." : (address ? "Generate New Wallet" : "Generate Wallet")}
              </Button>
              {address && (
                <>
                  <div>
                    <p className="font-bold">Wallet Address:</p>
                    <p className="break-all">{address}</p>
                    <p className="font-bold mt-2">Wallet Label:</p>
                    <p>{walletLabel || 'No label'}</p>
                    <form onSubmit={handleLabelSubmit} className="mt-2">
                      <Input
                        type="text"
                        placeholder="Enter new label"
                        value={newLabel}
                        onChange={handleLabelChange}
                        className="mb-2"
                      />
                      <Button type="submit">Update Label</Button>
                    </form>
                  </div>
                  <div>
                    <p className="font-bold">Actual TRX Balance:</p>
                    <p>{actualBalance} TRX</p>
                  </div>
                </>
              )}
              {walletInfo && (
                <div>
                  <p className="font-bold mt-2">Token Holdings:</p>
                  {walletInfo.tokens.map((token: any, index: number) => (
                    <p key={index}>{token.symbol}: {parseFloat(token.balance).toFixed(6)} (${token.usdValue})</p>
                  ))}
                  <p className="font-bold mt-2">Total Portfolio Value:</p>
                  <p>${walletInfo.totalPortfolioValueUsd}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </DashboardLayout>
  )
}

