export default function AbrechnungLoading() {
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
        <div className={`${pulse} h-10 w-44 bg-muted`} />
        <div className={`${pulse} h-5 w-96 bg-muted`} />
      </div>

      {/* Form sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={cardStyle}>
              <div className={`${pulse} h-5 w-40 bg-muted mb-4`} />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className={`${pulse} h-3 w-28 bg-muted`} />
                  <div className={`${pulse} h-10 w-full bg-muted`} />
                </div>
                <div className="space-y-2">
                  <div className={`${pulse} h-3 w-32 bg-muted`} />
                  <div className={`${pulse} h-10 w-full bg-muted`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview panel */}
        <div style={{ ...cardStyle, alignSelf: 'flex-start' }}>
          <div className={`${pulse} h-5 w-36 bg-muted mb-6`} />
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className={`${pulse} h-4 w-32 bg-muted`} />
                <div className={`${pulse} h-4 w-20 bg-muted`} />
              </div>
            ))}
            <div className="border-t border-border/40 pt-4">
              <div className={`${pulse} h-8 w-full bg-muted`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
