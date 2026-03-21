export default function MetersLoading() {
  const pulse = 'animate-pulse rounded';
  const cardStyle = {
    borderRadius: '4px',
    boxShadow: 'var(--nexo-card-shadow)',
    backgroundColor: 'var(--nexo-card-bg)',
    padding: '24px',
    height: '100%',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className={`${pulse} h-10 w-32 bg-muted`} />
        <div className={`${pulse} h-5 w-80 bg-muted`} />
      </div>

      {/* Predefined category cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ ...cardStyle, borderLeft: '4px solid var(--nexo-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`${pulse} rounded-full bg-muted`} style={{ width: 12, height: 12 }} />
              <div className={`${pulse} h-7 w-28 bg-muted`} />
            </div>
            <div className={`${pulse} h-4 w-full bg-muted mb-2`} />
            <div className={`${pulse} h-3 w-3/4 bg-muted`} />
          </div>
        ))}
      </div>

      {/* Weitere Zähler */}
      <div>
        <div className={`${pulse} h-6 w-36 bg-muted mb-4`} />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1].map((i) => (
            <div key={i} style={cardStyle}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`${pulse} h-5 w-5 bg-muted`} />
                <div className={`${pulse} h-7 w-24 bg-muted`} />
              </div>
              <div className={`${pulse} h-4 w-full bg-muted mb-2`} />
              <div className={`${pulse} h-4 w-2/3 bg-muted`} />
            </div>
          ))}
          {/* Add card placeholder */}
          <div
            style={{
              borderRadius: '4px',
              border: '2px dashed var(--nexo-border)',
              padding: '24px',
              minHeight: '160px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
