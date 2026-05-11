'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy route — redirects to the current swap UI (wagmi + ethers). */
export default function SwapOldPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/trade/swap');
  }, [router]);

  return (
    <p className="p-8 text-center text-muted-foreground">
      Redirecting to swap…
    </p>
  );
}
