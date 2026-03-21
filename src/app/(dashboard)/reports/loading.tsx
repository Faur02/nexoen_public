export default function ReportsLoading() {
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
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className={`${pulse} h-10 w-40 bg-muted`} />
          <div className={`${pulse} h-5 w-72 bg-muted`} />
        </div>
        <div className={`${pulse} h-10 w-36 bg-muted`} />
      </div>

      {/* Report sections */}
      {[0, 1].map((section) => (
        <div key={section} style={cardStyle}>
          <div className={`${pulse} h-5 w-44 bg-muted mb-6`} />
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className={`${pulse} rounded-full bg-muted`} style={{ width: 10, height: 10 }} />
                  <div className={`${pulse} h-4 w-32 bg-muted`} />
                </div>
                <div className={`${pulse} h-4 w-24 bg-muted`} />
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <div className={`${pulse} h-5 w-24 bg-muted`} />
              <div className={`${pulse} h-5 w-28 bg-muted`} />
            </div>
          </div>
        </div>
      ))}

      {/* Gesamtübersicht */}
      <div style={cardStyle}>
        <div className={`${pulse} h-5 w-40 bg-muted mb-6`} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`${pulse} h-3 w-20 bg-muted`} />
              <div className={`${pulse} h-8 w-28 bg-muted`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
