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
      const response = await fetch(`/api/logs?userId=${userId}&format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to download logs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ranking-logs-${userId}.${format}`;
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
