'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Database } from 'lucide-react';

interface DownloadLogsProps {
  userId: string;
}

export function DownloadLogs({ userId }: DownloadLogsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: 'json' | 'csv') => {
    setIsDownloading(true);
    try {
      // Generate mock log data
      const mockLogData = {
        userId,
        timestamp: new Date().toISOString(),
        session: {
          preferences: { diversity: 0.5, novelty: 0.5, freshness: 0.5 },
          articles_viewed: 8,
          interactions: 3
        },
        ranking_decisions: [
          { article_id: "1", original_rank: 0, personalized_rank: 1, reason: "High diversity score" },
          { article_id: "2", original_rank: 1, personalized_rank: 0, reason: "High novelty and freshness" },
          { article_id: "3", original_rank: 2, personalized_rank: 2, reason: "Balanced scores" }
        ]
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        content = JSON.stringify(mockLogData, null, 2);
        filename = `ranking-logs-${userId}.json`;
        mimeType = 'application/json';
      } else {
        // CSV format
        const csvRows = [
          ['timestamp', 'article_id', 'original_rank', 'personalized_rank', 'reason'],
          ...mockLogData.ranking_decisions.map(decision => [
            mockLogData.timestamp,
            decision.article_id,
            decision.original_rank,
            decision.personalized_rank,
            `"${decision.reason}"`
          ])
        ];
        content = csvRows.map(row => row.join(',')).join('\n');
        filename = `ranking-logs-${userId}.csv`;
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading logs:', error);
      alert('Failed to download logs. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => handleDownload('json')}
        disabled={isDownloading}
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
      >
        <Database className="w-3 h-3" />
        <span>JSON</span>
      </Button>
      <Button
        onClick={() => handleDownload('csv')}
        disabled={isDownloading}
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
      >
        <FileText className="w-3 h-3" />
        <span>CSV</span>
      </Button>
    </div>
  );
}
