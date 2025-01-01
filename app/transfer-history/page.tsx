"use client"

import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface TransferHistoryItem {
  txid: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  timestamp: number;
  status: string;
}

export default function TransferHistoryPage() {
  const { getTransferHistory, showFeedback } = useWallet()
  const [history, setHistory] = useState<TransferHistoryItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchTransferHistory();
  }, [currentPage])

  const fetchTransferHistory = async () => {
    try {
      const result = await getTransferHistory(currentPage, 10);
      setHistory(result.transactions);
      setTotalPages(result.totalPages);
      showFeedback("Transfer history updated", 'success');
    } catch (error) {
      console.error("Failed to get transfer history:", error);
      showFeedback(`Failed to get transfer history: ${error.message}`, 'error');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>View your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((transaction, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <p><strong>TxID:</strong> <a href={`https://tronscan.org/#/transaction/${transaction.txid}`} target="_blank" rel="noopener noreferrer">{transaction.txid}</a></p>
                <p><strong>From:</strong> {transaction.from}</p>
                <p><strong>To:</strong> {transaction.to}</p>
                <p><strong>Amount:</strong> {transaction.amount} {transaction.token}</p>
                <p><strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                <p><strong>Status:</strong> {transaction.status}</p>
              </div>
            ))}
            <div className="flex justify-between">
              <Button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

