import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TokenHolders() {
  const [address, setAddress] = useState("")
  const [holders, setHolders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokenHolders = async () => {
    setIsLoading(true)
    setError(null)
    setHolders([])

    const baseUrl = "https://api.sunpump.meme/pump-api/token/holders?page=%d&size=10&address="

    try {
      let allHolders: any[] = [];
      for (let page = 1; page <= 2; page++) {
        const url = `${baseUrl.replace("%d", page.toString())}${address}`;
        const response = await fetch(url)
        const data = await response.json()
        allHolders = [...allHolders, ...data.data.holders]
      }
      setHolders(allHolders)
    } catch (error) {
      console.error("Error fetching token holders:", error)
      setError("Failed to fetch token holders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setAddress("")
    setHolders([])
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
        <Button onClick={fetchTokenHolders} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Fetch
        </Button>
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {holders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Token Holders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holders.map((holder, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{holder.address}</TableCell>
                    <TableCell>{holder.percentage.toFixed(2)}%</TableCell>
                    <TableCell>{holder.holderType !== "NORMAL_USER" ? holder.holderType : "Normal User"}</TableCell>
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

