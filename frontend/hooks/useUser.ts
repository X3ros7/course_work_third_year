import { me } from '@/services/userService';
import { User } from '@/types/userTypes';
import { useEffect, useState } from 'react';

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await me();
      setUser(response.data as User);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  return { user, isLoading };
}
