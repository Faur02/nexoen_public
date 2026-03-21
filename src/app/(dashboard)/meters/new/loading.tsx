export default function NewMeterLoading() {
  const pulse = 'animate-pulse rounded bg-muted';
  const cardStyle = {
    borderRadius: '4px',
    boxShadow: 'var(--nexo-card-shadow)',
    backgroundColor: 'var(--nexo-card-bg)',
    padding: '24px',
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <div className={`${pulse} h-9 w-48`} />
        <div className={`${pulse} h-4 w-64`} />
      </div>
      <div style={cardStyle}>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`${pulse} h-4 w-24`} />
              <div className={`${pulse} h-10 w-full`} />
            </div>
          ))}
          <div className={`${pulse} h-10 w-32 mt-2`} />
        </div>
      </div>
    </div>
  );
}
