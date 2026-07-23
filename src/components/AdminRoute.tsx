import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">ސްލޯއެޑުން...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
