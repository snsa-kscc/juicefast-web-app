"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ExternalSiteWrapperProps {
  url: string;
  useIframe?: boolean;
  height?: string;
}

export function ExternalSiteWrapper({ url, useIframe = true, height = "800px" }: ExternalSiteWrapperProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // For server-side proxy approach
  useEffect(() => {
    if (!useIframe) {
      const fetchExternalContent = async () => {
        try {
          setIsLoading(true);
          // This would call your API route that proxies the external content
          const response = await fetch(`/api/proxy-external-site?url=${encodeURIComponent(url)}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.status}`);
          }

          const html = await response.text();
          setContent(html);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching external content:", err);
          setError(err instanceof Error ? err.message : "Failed to load external content");
          setIsLoading(false);
        }
      };

      fetchExternalContent();
    }
  }, [url, useIframe]);

  // Handle navigation events from iframe if needed
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={() => router.refresh()} className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
          Try Again
        </button>
      </div>
    );
  }

  if (useIframe) {
    return (
      <div className="w-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        <iframe
          src={url}
          className="w-full"
          style={{ height }}
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer"
          title="External Content"
        />
      </div>
    );
  }

  // For server-side proxy approach
  return (
    <div className="w-full overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="external-content-wrapper" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}
