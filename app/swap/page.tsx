"use client"

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from "react"
import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function SwapPage() {
  const { address, tokenBalances, getSwapRoutes, executeSwap, executeSunpumpSwap, showFeedback, generateWallet } = useWallet()
  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")
  const [amount, setAmount] = useState("")
  const [swapRoute, setSwapRoute] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [swapType, setSwapType] = useState("regular")

  const handleGetRoutes = async () => {
    if (!fromToken || !toToken || !amount) {
      showFeedback("Please fill all fields", 'error');
      return;
    }
    try {
      const routes = await getSwapRoutes(fromToken, toToken, amount);
      setSwapRoute(routes[0]);
      setSelectedRoute(routes[0]);
      showFeedback("Swap route found", 'success');
    } catch (error) {
      console.error("Failed to get swap routes:", error);
      showFeedback(`Failed to get swap routes: ${error.message}`, 'error');
    }
  };

  const handleSwap = async () => {
    if (swapType === "regular" && !selectedRoute) {
      showFeedback("Please select a swap route", 'error')
      return
    }
    setShowConfirmation(true);
  };

  const executeConfirmedSwap = async () => {
    setIsLoading(true);
    try {
      let result;
      if (swapType === "regular") {
        result = await executeSwap(selectedRoute.route, amount, selectedRoute.expectedOutput);
      } else {
        result = await executeSunpumpSwap(amount);
      }
      console.log("Swap executed:", result);
      showFeedback(`Swap executed successfully. Transaction ID: ${result.txid}`, 'success');
      setIsLoading(false);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Swap failed:", error);
      showFeedback(`Swap failed: ${error.message}`, 'error');
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

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
            <CardDescription>You need to generate a wallet to access the Swap feature</CardDescription>
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
          <CardTitle>Swap Tokens</CardTitle>
          <CardDescription>Exchange one token for another</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup defaultValue="regular" onValueChange={(value) => setSwapType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular Swap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sunpump" id="sunpump" />
                <Label htmlFor="sunpump">Sunpump Swap</Label>
              </div>
            </RadioGroup>

            {swapType === "regular" && (
              <>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="From Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenBalances.map((token, index) => (
                      <SelectItem key={index} value={token.symbol}>{token.symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="To Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenBalances.map((token, index) => (
                      <SelectItem key={index} value={token.symbol}>{token.symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {swapType === "sunpump" && (
              <p>Sunpump swap: TRX to PUMP</p>
            )}

            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {swapType === "regular" && (
              <Button onClick={handleGetRoutes}>Get Swap Routes</Button>
            )}

            {swapType === "regular" && swapRoute && (
              <div className="mt-4 p-4 border rounded">
                <h3 className="text-lg font-semibold">Swap Route</h3>
                <p>Route: {swapRoute.route.join(' -> ')}</p>
                <p>Expected Output: {swapRoute.expectedOutput}</p>
                <p>Fee: {swapRoute.fee}</p>
                <Button onClick={() => setSelectedRoute(swapRoute)}>Select Route</Button>
              </div>
            )}

            <Button onClick={handleSwap} disabled={isLoading || (swapType === "regular" && !selectedRoute)}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Swap
            </Button>
          </div>
        </CardContent>
      </Card>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Swap</h3>
            {swapType === "regular" ? (
              <>
                <p>From: {amount} {fromToken}</p>
                <p>To: {selectedRoute.expectedOutput} {toToken}</p>
                <p>Price Impact: {selectedRoute.priceImpact}</p>
                <p>Fee: {selectedRoute.fee}</p>
              </>
            ) : (
              <p>Swap {amount} TRX for PUMP tokens</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setShowConfirmation(false)} variant="outline">Cancel</Button>
              <Button onClick={executeConfirmedSwap} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Swap
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

