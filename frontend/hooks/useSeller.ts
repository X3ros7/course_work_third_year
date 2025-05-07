import { useState, useEffect } from 'react';

export default function useSeller() {
  const [isSeller, setIsSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if seller token exists in localStorage
    const sellerToken = localStorage.getItem('sellerToken');
    setIsSeller(!!sellerToken);
    setIsLoading(false);
  }, []);

  return { isSeller, isLoading };
}
