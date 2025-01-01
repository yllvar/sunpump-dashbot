import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { log } from '@/lib/logger'
import dynamic from 'next/dynamic'
const TokenEventChart = dynamic(() => import('./TokenEventChart'), { ssr: false })

interface TokenEvent {
  block_number: number;
  block_timestamp: number;
  event_name: string;
  transaction_id: string;
  _unconfirmed: boolean;
}

export function KingOfTheHill() {
  const [events, setEvents] = useState<TokenEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokenEvents() {
      log.info('Fetching Token Events');
      try {
        const response = await fetch('https://api.trongrid.io/v1/contracts/TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw/events');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        log.info('Received Token Events data', { data });
        setEvents(data.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load Token Events data: ${errorMessage}`);
        log.error('Error fetching Token Events data', { error: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokenEvents();
  }, []);

  if (isLoading) {
    return <Card><CardContent>Loading Token Events data...</CardContent></Card>;
  }

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
    <Card>
      <CardHeader>
        <CardTitle>Recent Token Events</CardTitle>
      </CardHeader>
      <CardContent>
        <TokenEventChart events={events} />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recent Events:</h3>
          <ul className="list-disc list-inside">
            {events.slice(0, 5).map((event, index) => (
              <li key={index}>
                {event.event_name} at block {event.block_number}
                {event._unconfirmed && " (Unconfirmed)"}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

