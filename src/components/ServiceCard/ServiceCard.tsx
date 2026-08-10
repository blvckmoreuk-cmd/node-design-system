import type { CSSProperties } from 'react';
import type { Service } from '../../data/services';
import './ServiceCard.css';

export interface ServiceCardProps {
  service: Service;
  compact?: boolean;
  onOpen: (service: Service) => void;
}

export function ServiceCard({ service, compact = false, onOpen }: ServiceCardProps) {
  return (
    <button
      type="button"
      className={`service-card svc group${compact ? ' compact' : ''}`}
      style={{ '--ch': service.hex } as CSSProperties}
      aria-haspopup="dialog"
      onClick={() => onOpen(service)}
    >
      <span className="svc-bar" aria-hidden="true" />
      <div className="flex items-start justify-between">
        <span className="svc-num">{service.num}</span>
        <div className="flex flex-col items-end gap-1.5">
          {service.firstOrderOffer && <span className="svc-offer">50% OFF 1ST ORDER</span>}
          <span className="svc-open">Open &rarr;</span>
        </div>
      </div>
      <div className="svc-body">
        <h3 className="svc-title">{service.title}</h3>
        <p className="svc-tagline">{service.tagline}</p>
        <p className="svc-detail">{service.detail}</p>
      </div>
      <div className="svc-foot">
        {service.revisions ? (
          <span className="svc-rev">&#8635; {service.revisions}</span>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className="svc-price">{service.price}</span>
      </div>
    </button>
  );
}
