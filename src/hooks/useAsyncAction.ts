import { useState } from "react";

export function useAsyncAction<T extends (...args: any[]) => Promise<void>>(action: T) {
  const [isLoading, setIsLoading] = useState(false);

  const run = async (...args: Parameters<T>) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await action(...args);
    } finally {
      setIsLoading(false);
    }
  };

  return { run, isLoading };
}
