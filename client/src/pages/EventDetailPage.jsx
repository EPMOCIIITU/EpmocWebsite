import { useParams } from 'react-router-dom';

export default function EventDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 gap-4">
      <div className="mono text-green-500">EVENT_DETAIL_SYSTEM_OFFLINE // PENDING_PHASE</div>
      <div className="mono text-xs opacity-50">REQUESTED_ID: {id}</div>
    </div>
  );
}
