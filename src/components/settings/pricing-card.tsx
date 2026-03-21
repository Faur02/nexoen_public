'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isCurrent: boolean;
  highlighted?: boolean;
  onSelect?: () => void;
  loading?: boolean;
  buttonLabel?: string;
}

const cardShadow = 'var(--nexo-card-shadow)';

export function PricingCard({
  name,
  price,
  description,
  features,
  isCurrent,
  highlighted,
  onSelect,
  loading,
  buttonLabel,
}: PricingCardProps) {
  return (
    <Card
      className="relative flex flex-col"
      style={{
        borderRadius: '4px',
        boxShadow: cardShadow,
        border: highlighted ? '2px solid var(--nexo-cta)' : undefined,
      }}
    >
      {highlighted && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-white px-4 py-1 text-xs font-medium"
          style={{ backgroundColor: 'var(--nexo-cta)', borderRadius: '4px' }}
        >
          Empfohlen
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
          {name}
          {isCurrent && (
            <span
              className="inline-flex items-center px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: 'var(--nexo-surface)', color: 'var(--nexo-text-secondary)', borderRadius: '4px' }}
            >
              Aktuell
            </span>
          )}
        </CardTitle>
        <CardDescription className="font-body">{description}</CardDescription>
        <div className="pt-4">
          <span className="font-heading" style={{ fontSize: '36px', fontWeight: 400, color: 'var(--nexo-text-primary)' }}>
            {price}
          </span>
          <span style={{ color: 'var(--nexo-text-secondary)', marginLeft: '4px' }}>/Monat</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 flex-1">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--nexo-text-secondary)' }}>
              <span
                className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                style={{
                  borderRadius: '4px',
                  backgroundColor: feature.included ? 'rgba(29, 120, 116, 0.1)' : 'var(--nexo-surface)',
                }}
              >
                {feature.included ? (
                  <svg className="w-3 h-3" style={{ color: 'var(--nexo-cta)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" style={{ color: 'var(--nexo-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
              <span style={{ color: feature.included ? 'var(--nexo-text-secondary)' : 'var(--nexo-progress-avg)' }}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        {onSelect && !isCurrent && (
          <Button
            onClick={onSelect}
            disabled={loading}
            className="w-full mt-6"
            size="lg"
            style={{
              backgroundColor: highlighted ? 'var(--nexo-cta)' : undefined,
              borderRadius: '4px',
            }}
            variant={highlighted ? 'default' : 'outline'}
          >
            {loading ? 'Wird geladen...' : buttonLabel || 'Auswählen'}
          </Button>
        )}
        {isCurrent && (
          <div className="mt-6 text-center text-sm font-medium" style={{ color: 'var(--nexo-cta)' }}>
            Ihr aktuelles Abonnement
          </div>
        )}
      </CardContent>
    </Card>
  );
}
