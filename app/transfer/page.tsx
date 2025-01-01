"use client"

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from "react"
import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

export default function TransferPage() {
  const { address, tokenBalances, transferTRX, transferToken, showFeedback, generateWallet } = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState("TRX")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleTransfer = async () => {
    if (!address) {
      showFeedback("Please generate a wallet first", 'error');
      return;
    }

    if (!recipient || !amount) {
      showFeedback("Please enter recipient address and amount", 'error');
      return;
    }

    setShowConfirmation(true);
  }

  const executeTransfer = async () => {
    setIsLoading(true);
    try {
      if (selectedToken === "TRX") {
        const result = await transferTRX(recipient, amount);
        setTxHash(result.txid);
        showFeedback(`Successfully transferred ${amount} TRX`, 'success');
      } else {
        const token = tokenBalances.find(t => t.symbol === selectedToken);
        if (token) {
          await transferToken(recipient, amount, token.symbol);
          showFeedback(`Successfully transferred ${amount} ${selectedToken}`, 'success');
        } else {
          showFeedback("Selected token not found", 'error');
        }
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      showFeedback(`Transfer failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  }

  const handleGenerateWallet = async () => {
    try {
      await generateWallet();
      showFeedback("Wallet generated successfully", 'success');
    } catch (error) {
      console.error("Failed to generate wallet:", error);
      showFeedback(`Failed to generate wallet: ${error.message}`, 'error');
    }
  };

  if (!address) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Required</CardTitle>
            <CardDescription>You need to generate a wallet to access the Transfer feature</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerateWallet}>Generate Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Tokens</CardTitle>
          <CardDescription>Send TRX or other tokens to another wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRX">TRX</SelectItem>
                {tokenBalances.map((token, index) => (
                  <SelectItem key={index} value={token.symbol}>{token.symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleTransfer} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Transfer
            </Button>
          </div>
          {txHash && (
            <div className="mt-4">
              <p>Transaction successful!</p>
              <p>Transaction Hash: <a href={`https://tronscan.org/#/transaction/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></p>
            </div>
          )}
        </CardContent>
      </Card>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Transfer</h3>
            <p>To: {recipient}</p>
            <p>Amount: {amount} {selectedToken}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setShowConfirmation(false)} variant="outline">Cancel</Button>
              <Button onClick={executeTransfer} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Transfer
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

