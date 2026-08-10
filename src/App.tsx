import { useState } from 'react';
import { Logo } from './components/Logo/Logo';
import { Button } from './components/Button/Button';
import { ClientMarquee } from './components/ClientMarquee/ClientMarquee';
import { Header } from './components/Header/Header';
import { PromoBar } from './components/PromoBar/PromoBar';
import { SectionFrame } from './components/SectionFrame/SectionFrame';
import { SectionHeader } from './components/SectionHeader/SectionHeader';
import { ServiceCard } from './components/ServiceCard/ServiceCard';
import { ServiceModal } from './components/ServiceModal/ServiceModal';
import { ReviewsCarousel } from './components/ReviewsCarousel/ReviewsCarousel';
import { SuccessPopup } from './components/SuccessPopup/SuccessPopup';
import { Visualiser } from './visualiser/Visualiser';
import { services, type Service } from './data/services';
import { testimonials } from './data/testimonials';

const CLIENTS = ['Casmalia', 'Solara', 'Morry', 'Akonite', 'Covert', 'UKF', 'Motive'];
const TRACKS = [
  { label: 'Feel It — Mix/Master', src: '/audio/feelit.mp3' },
  { label: 'Shake It — Mix/Master', src: '/audio/shakeit.mp3' },
];

export default function App() {
  const [openService, setOpenService] = useState<Service | null>(null);

  return (
    <div className="ds-surface min-h-screen flex flex-col items-center px-3 md:px-4 py-6 md:py-12">
      <PromoBar />
      <Header currentPath="/" />

      <div className="w-full max-w-5xl flex flex-col gap-8 mt-8">
        <SectionFrame>
          <ClientMarquee clients={CLIENTS} />
          <SectionHeader num="01" label="Our Work / Press Play" />
          <Visualiser tracks={TRACKS} />
        </SectionFrame>

        <SectionFrame>
          <SectionHeader num="02" label="Services / Signal Chain" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4">
            {services.map((service) => (
              <ServiceCard key={service.num} service={service} compact onOpen={setOpenService} />
            ))}
          </div>
        </SectionFrame>

        <ReviewsCarousel testimonials={testimonials} />

        <div className="flex items-center gap-4 pb-8">
          <Logo size={48} />
          <Button href="/contact">Start a Project</Button>
          <Button variant="secondary" href="/prices">Rates</Button>
        </div>
      </div>

      <ServiceModal service={openService} onClose={() => setOpenService(null)} />
      <SuccessPopup />
    </div>
  );
}
