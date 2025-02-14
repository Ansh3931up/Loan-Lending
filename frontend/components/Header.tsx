'use client';

import { useUser } from '@/context/UserContext';
import Image from 'next/image';

export default function Header() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <header className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Image
              src={user.avatar}
              alt={user.fullname}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-medium">{user.fullname}</span>
          </>
        )}
      </div>
    </header>
  );
} 