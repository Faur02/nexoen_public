'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function CursorTooltip({
  text,
  children,
  className,
  style,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const offset = 14;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    // Flip horizontally if tooltip would overflow right edge
    const tooltipWidth = tooltipRef.current?.offsetWidth || 240;
    if (x + tooltipWidth > window.innerWidth - 8) {
      x = e.clientX - offset - tooltipWidth;
    }

    // Flip vertically if tooltip would overflow bottom edge
    const tooltipHeight = tooltipRef.current?.offsetHeight || 60;
    if (y + tooltipHeight > window.innerHeight - 8) {
      y = e.clientY - offset - tooltipHeight;
    }

    setPos({ x, y });
  };

  const tooltip = visible && mounted
    ? createPortal(
        <div
          ref={tooltipRef}
          className="font-body"
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            backgroundColor: 'var(--nexo-text-primary)',
            color: 'var(--nexo-card-bg)',
            fontSize: '12px',
            lineHeight: '160%',
            padding: '8px 14px',
            borderRadius: '4px',
            maxWidth: 240,
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 9999,
            whiteSpace: 'normal',
          }}
        >
          {text}
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      className={className}
      style={style}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {tooltip}
    </div>
  );
}
