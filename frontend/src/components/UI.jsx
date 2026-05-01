import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className={`${sizes[size]} text-emerald-400 animate-spin`} />
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}

export function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <p className="text-slate-300">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-primary text-sm">Try Again</button>}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      <p className="text-slate-400 text-sm text-center max-w-md">{message}</p>
    </div>
  );
}

export function StarRating({ rating, onRate, interactive = false, size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' };
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          className={`${sizes[size]} ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'} transition-transform ${star <= rating ? 'text-amber-400' : 'text-slate-600'}`}
          disabled={!interactive}
        >★</button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    pending: 'badge-warning',
    accepted: 'badge-success',
    rejected: 'badge-error',
    completed: 'badge-info',
  };
  return <span className={`badge ${styles[status] || 'badge-info'}`}>{status}</span>;
}
