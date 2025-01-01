import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TokenLookup() {
  const [address, setAddress] = useState("")
  const [tokenInfo, setTokenInfo] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokenDetails = async () => {
    setIsLoading(true)
    setError(null)
    setTokenInfo(null)

    const url = `https://api.sunpump.meme/pump-api/token/${address}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (data.msg === "SUCCESS") {
        setTokenInfo(data.data)
      } else {
        setError("Failed to fetch token details. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching token details:", error)
      setError("Failed to fetch token details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setAddress("")
    setTokenInfo(null)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Token Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={fetchTokenDetails} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Lookup
        </Button>
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {tokenInfo && (
        <Card>
          <CardHeader>
            <CardTitle>{tokenInfo.name} ({tokenInfo.symbol})</CardTitle>
            <CardDescription>Contract: {tokenInfo.contractAddress}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Launch Date:</span>
              <span>{new Date(tokenInfo.tokenLaunchedInstant * 1000).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Supply:</span>
              <span>{parseFloat(tokenInfo.totalSupply).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Holders:</span>
              <span>{tokenInfo.holders.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Market Cap:</span>
              <span>${parseFloat(tokenInfo.marketCap).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Price:</span>
              <span>${parseFloat(tokenInfo.priceInUsd).toFixed(8)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              {tokenInfo.twitterUrl && (
                <Badge variant="secondary">
                  <a href={tokenInfo.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Twitter <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Badge>
              )}
              {tokenInfo.telegramUrl && (
                <Badge variant="secondary">
                  <a href={tokenInfo.telegramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Telegram <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Badge>
              )}
              {tokenInfo.websiteUrl && (
                <Badge variant="secondary">
                  <a href={tokenInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Website <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Badge>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

