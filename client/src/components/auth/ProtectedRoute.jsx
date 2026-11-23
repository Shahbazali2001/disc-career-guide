import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="glass-card flex items-center gap-3 px-6 py-4 text-sm text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          <span>Verifying your session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
