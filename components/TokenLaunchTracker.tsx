import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface TokenLaunch {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  launchDate: Date;
}

interface TokenAnalytics {
  marketCap: number;
  volume: number;
  price: number;
}

export function TokenLaunchTracker() {
  const [tokenLaunches, setTokenLaunches] = useState<TokenLaunch[]>([]);
  const [tokenAnalytics, setTokenAnalytics] = useState<{[address: string]: TokenAnalytics}>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenLaunches = async () => {
      try {
        const response = await fetch('/api/token-launches');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTokenLaunches(data);
        data.forEach((token: TokenLaunch) => fetchTokenAnalytics(token.address));
      } catch (error) {
        console.error('Failed to fetch token launches:', error);
        setError('Failed to fetch recent token launches. Please try again later.');
      }
    };

    fetchTokenLaunches();
  }, []);

  const fetchTokenAnalytics = async (tokenAddress: string) => {
    try {
      const response = await fetch(`/api/token-analytics/${tokenAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const analytics = await response.json();
      setTokenAnalytics(prev => ({...prev, [tokenAddress]: analytics}));
    } catch (error) {
      console.error('Failed to fetch token analytics:', error);
      setError('Failed to fetch token analytics. Please try again later.');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-card text-primary">
      <CardHeader>
        <CardTitle>Recent Token Launches</CardTitle>
        <CardDescription>Track newly launched tokens and their analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="text-primary">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Total Supply</TableHead>
              <TableHead>Launch Date</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Volume (24h)</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenLaunches.map((token) => (
              <TableRow key={token.address}>
                <TableCell>{token.name}</TableCell>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>{token.totalSupply}</TableCell>
                <TableCell>{new Date(token.launchDate).toLocaleString()}</TableCell>
                <TableCell>
                  {tokenAnalytics[token.address]
                    ? `$${tokenAnalytics[token.address].marketCap.toLocaleString()}`
                    : 'Loading...'}
                </TableCell>
                <TableCell>
                  {tokenAnalytics[token.address]
                    ? `$${tokenAnalytics[token.address].volume.toLocaleString()}`
                    : 'Loading...'}
                </TableCell>
                <TableCell>
                  {tokenAnalytics[token.address]
                    ? `$${tokenAnalytics[token.address].price.toFixed(6)}`
                    : 'Loading...'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

