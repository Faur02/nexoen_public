export default function SettingsLoading() {
  const pulse = 'animate-pulse rounded bg-muted';
  const cardStyle = {
    borderRadius: '4px',
    boxShadow: 'var(--nexo-card-shadow)',
    backgroundColor: 'var(--nexo-card-bg)',
    padding: '24px',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className={`${pulse} h-9 w-48`} />
        <div className={`${pulse} h-4 w-64`} />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={cardStyle}>
          <div className={`${pulse} h-5 w-40 mb-2`} />
          <div className={`${pulse} h-4 w-56 mb-6`} />
          <div className={`${pulse} h-10 w-full`} />
        </div>
      ))}
    </div>
  );
}
