export default function DashboardLoading() {
  const pulse = 'animate-pulse rounded';
  const cardStyle = {
    borderRadius: '4px',
    boxShadow: 'var(--nexo-card-shadow)',
    backgroundColor: 'var(--nexo-card-bg)',
    padding: '24px',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className={`${pulse} h-10 w-48 bg-muted`} />
        <div className={`${pulse} h-5 w-72 bg-muted`} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} style={cardStyle}>
            <div className={`${pulse} h-4 w-32 bg-muted mb-4`} />
            <div className={`${pulse} h-10 w-40 bg-muted mb-2`} />
            <div className={`${pulse} h-3 w-24 bg-muted`} />
          </div>
        ))}
      </div>

      {/* Donut chart card */}
      <div style={cardStyle}>
        <div className={`${pulse} h-4 w-40 bg-muted mb-6`} />
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className={`${pulse} rounded-full bg-muted`} style={{ width: 200, height: 200, flexShrink: 0 }} />
          <div className="flex-1 space-y-3 w-full">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`${pulse} rounded-full bg-muted`} style={{ width: 10, height: 10, flexShrink: 0 }} />
                <div className={`${pulse} h-3 bg-muted flex-1`} />
                <div className={`${pulse} h-3 w-16 bg-muted`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison section */}
      <div style={cardStyle}>
        <div className={`${pulse} h-4 w-36 bg-muted mb-6`} />
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`${pulse} h-3 w-24 bg-muted`} />
              <div className={`${pulse} h-2 w-full bg-muted rounded-full`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
