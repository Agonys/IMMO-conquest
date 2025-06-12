import { useEffect, useState } from 'react';
import { MapPin, MousePointerClick, Pointer, X } from 'lucide-react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useClickOutside, useMediaQuerySizes } from '@/hooks';
import { Location } from '@/types';
import { cn } from '@/utils';

interface LocationSelectProps {
  locations: Location[];
  onSelect?: (locationName: string) => void;
}
export const LocationSelect = ({ locations, onSelect }: LocationSelectProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(locations[0]);
  const [openModal, setOpenModal] = useState(false); // controls transition state
  const [showModal, setShowModal] = useState(false); // controls mounting
  const { screenSizes } = useMediaQuerySizes();
  const portalContentRef = useClickOutside<HTMLDivElement>(() => {
    handleCloseModal();
  });

  const handleOnModalTrigger = () => {
    setShowModal(true);
    document.body.classList.add('overflow-hidden');

    // animation
    setTimeout(() => {
      setOpenModal(true);
    }, 10);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    document.body.classList.remove('overflow-hidden');
  };

  const handleSelectOption = (location: Location) => {
    if (location.name !== selectedLocation?.name) {
      setSelectedLocation(location);
      onSelect?.(location.name);
    }

    handleCloseModal();
  };

  useEffect(() => {
    if (!openModal && showModal) {
      const timeout = setTimeout(() => setShowModal(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [openModal, showModal]);

  const portalContent = showModal ? (
    <div
      className={cn(
        'pointer-event-none fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center opacity-0 transition-[opacity] duration-150 ease-in-out',
        openModal && 'pointer-event-auto opacity-100',
      )}
    >
      {/* Cover */}
      <div className="fixed top-0 left-0 z-10 h-screen w-screen bg-black/70" />

      {/* Content */}
      <div
        className={cn(
          'bg-card oveflow-hidden z-20 flex max-h-11/12 max-w-11/12 min-w-[300px] flex-col overflow-hidden rounded-xl transition-[scale] ease-in-out',
          openModal ? 'scale-100' : 'scale-95',
        )}
        ref={portalContentRef}
      >
        {/* Header */}
        <div className="border-card-border flex items-center justify-between border-b-2 p-4">
          <strong className="text-lg">Select Location</strong>
          <X size={20} onClick={handleCloseModal} className="cursor-pointer" />
        </div>

        <div className="flex flex-col gap-6 overflow-hidden p-4">
          {/* Current Location */}
          <div className="bg-background relative flex shrink-0 items-center gap-3 overflow-hidden rounded-md p-4">
            <Image
              width={350}
              height={200}
              src={selectedLocation?.image || ''}
              alt={selectedLocation?.name || ''}
              sizes="(min-width: 320px) 100vw, 100vw"
              className={cn(
                'absolute top-0 right-0 bottom-0 my-auto h-auto w-full opacity-15',
                'mask-l-from-black mask-l-from-0% mask-l-to-transparent mask-l-to-80%',
              )}
            />
            <MapPin className="text-yellow-light z-10" />
            <div className="text-foreground-darker z-10 flex flex-col">
              <span className="text-sm">Current Location</span>
              <span className="text-foreground font-semibold">{selectedLocation?.name}</span>
            </div>
          </div>

          {/* Locations list */}
          <div className="h-full overflow-hidden overflow-y-auto">
            <div className="flex shrink-0 flex-col gap-x-4 gap-y-2 md:grid md:grid-cols-2">
              {locations.map((location) => {
                return (
                  <div
                    key={location.name}
                    onClick={() => handleSelectOption(location)}
                    role="button"
                    className="group relative flex h-32 min-w-[200px] cursor-pointer items-end overflow-hidden rounded-lg transition-all"
                  >
                    <div className="absolute top-0 left-0 z-20 h-full w-full bg-black/50 transition-colors group-hover:bg-black/30" />
                    <Image
                      fill
                      src={location?.image || ''}
                      alt={location?.name || ''}
                      sizes="(min-width: 320px) 100vw, 100vw"
                      className={cn('absolute z-10 object-cover object-center')}
                    />
                    <span className="text-outline-black text-foreground relative z-30 w-full p-4 font-semibold">
                      {location?.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        onClick={handleOnModalTrigger}
        className="border-card-border flex w-max cursor-pointer flex-col overflow-hidden rounded-md border text-sm"
      >
        {/* Trigger */}
        <div className="bg-card-header boder-b mb-px flex w-full items-center justify-between gap-8 border-b-white px-3 py-2">
          <span>Select Region</span>
          {screenSizes.md ? <MousePointerClick size={20} /> : <Pointer size={16} />}
        </div>

        {/* Preview */}
        <div className="relative flex items-center justify-center p-2 select-none">
          <Image
            fill
            src={selectedLocation?.image || ''}
            alt={selectedLocation?.name || ''}
            sizes="(min-width: 320px) 100vw, 100vw"
            className="absolute h-full w-full object-cover brightness-40"
          />

          <span className="text-outline-black z-20 font-semibold">{selectedLocation?.name}</span>
        </div>
      </div>
      {createPortal(portalContent, document.body)}
    </>
  );
};
