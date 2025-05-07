import { Order } from '@/types/orderTypes';
import { useEffect } from 'react';
import { useState } from 'react';
import { getOrders } from '@/services/userService';

export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrders();
      setOrders(response.data as Order[]);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  return { orders, isLoading };
}
