export default function MeterDetailLoading() {
  const pulse = 'animate-pulse rounded';
  const cardStyle = {
    borderRadius: '4px',
    boxShadow: 'var(--nexo-card-shadow)',
    backgroundColor: 'var(--nexo-card-bg)',
    padding: '24px',
  };

  return (
    <div className="space-y-8">
      {/* Back link + header */}
      <div className="space-y-3">
        <div className={`${pulse} h-4 w-24 bg-muted`} />
        <div className={`${pulse} h-10 w-48 bg-muted`} />
        <div className={`${pulse} h-5 w-64 bg-muted`} />
      </div>

      {/* Tabs row */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${pulse} h-9 w-28 bg-muted`} />
        ))}
      </div>

      {/* Tab content area */}
      <div style={cardStyle}>
        <div className={`${pulse} h-5 w-40 bg-muted mb-6`} />
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
              <div className={`${pulse} h-4 w-28 bg-muted`} />
              <div className={`${pulse} h-4 w-20 bg-muted`} />
              <div className={`${pulse} h-4 w-16 bg-muted`} />
            </div>
          ))}
        </div>
      </div>

      {/* Forecast card */}
      <div style={cardStyle}>
        <div className={`${pulse} h-5 w-48 bg-muted mb-4`} />
        <div className={`${pulse} h-12 w-36 bg-muted mb-3`} />
        <div className={`${pulse} h-3 w-full bg-muted rounded-full`} />
      </div>
    </div>
  );
}
