import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function TokenTransactions() {
  const [address, setAddress] = useState("")
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTopTransactions = async () => {
    setIsLoading(true)
    setError(null)
    setTransactions([])

    const url = `https://api.sunpump.meme/pump-api/transactions/token/${address}?page=1&size=5&sort=volumeInUsd:DESC`

    try {
      const response = await fetch(url)
      const data = await response.json()
      setTransactions(data.data.swaps)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError("Failed to fetch transactions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setAddress("")
    setTransactions([])
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
        <Button onClick={fetchTopTransactions} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Fetch
        </Button>
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{tx.userAddress}</TableCell>
                    <TableCell>${parseFloat(tx.volumeInUsd).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={tx.txnOrderType === "BUY" ? "success" : "destructive"}>
                        {tx.txnOrderType}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

