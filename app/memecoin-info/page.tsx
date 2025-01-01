"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MemecoinInfoPage() {
  const { getMemeTokenInfo, showFeedback } = useWallet()
  const [tokenAddress, setTokenAddress] = useState("")
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  const handleGetInfo = async () => {
    if (!tokenAddress) {
      showFeedback("Please enter a token address", 'error');
      return;
    }
    try {
      const info = await getMemeTokenInfo(tokenAddress);
      setTokenInfo(info);
      showFeedback("Token info retrieved successfully", 'success');
    } catch (error) {
      console.error("Failed to get token info:", error);
      showFeedback(`Failed to get token info: ${error.message}`, 'error');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Memecoin Info</CardTitle>
          <CardDescription>Get detailed information about a memecoin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Token Address"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
            />
            <Button onClick={handleGetInfo}>Get Info</Button>
            {tokenInfo && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">{tokenInfo.name} ({tokenInfo.symbol})</h3>
                <p>Total Supply: {tokenInfo.totalSupply}</p>
                <p>Holders: {tokenInfo.holders}</p>
                <p>Price: ${tokenInfo.price}</p>
                <p>Description: {tokenInfo.description}</p>
                <h4 className="font-bold mt-2">Social Media:</h4>
                <ul>
                  {tokenInfo.socialMedia.map((social: any, index: number) => (
                    <li key={index}>{social.platform}: <a href={social.url} target="_blank" rel="noopener noreferrer">{social.url}</a></li>
                  ))}
                </ul>
                <h4 className="font-bold mt-2">Price History:</h4>
                <ul>
                  {tokenInfo.priceHistory.map((history: any, index: number) => (
                    <li key={index}>{history.date}: ${history.price}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

