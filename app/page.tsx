"use client"

import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { KingOfTheHill } from '@/components/KingOfTheHill'

export default function Home() {
  const { address, balance, tokenBalances } = useWallet()
  const tokenList = tokenBalances?.slice(0, 5) || [];

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance} TRX</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenBalances?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">{address || 'No wallet generated'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Link href="/transfer">
                <Button size="sm">Transfer</Button>
              </Link>
              <Link href="/swap">
                <Button size="sm">Swap</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokenList.map((token, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{token.symbol}</span>
                  <span>{token.balance}</span>
                </div>
              ))}
              {tokenList.length === 0 && (
                <p className="text-muted-foreground">No tokens found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <KingOfTheHill />
      </div>
    </DashboardLayout>
  )
}

