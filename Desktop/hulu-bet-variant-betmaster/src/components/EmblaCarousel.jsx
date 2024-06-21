import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const Thumb = ({ selected, style = null, onClick }) => {
  const bg = style === 'primary' ? 'bg-gray-400' : 'bg-gray-200';
  const activeBg = style === 'primary' ? 'bg-primary-700' : 'bg-gray-200';

  return (
    <button
      type="button"
      className={` rounded-full  ${
        selected ? activeBg + ' h-2 w-2 ' : bg + ' h-1.5 w-1.5 '
      }`}
      onClick={onClick}
    />
  );
};

const PrevButton = (props) => {
  const { enabled, onClick } = props;

  return (
    <button
      className={` z-50 h-5 w-5  ${
        enabled ? 'cursor-pointer' : 'cursor-not-allowed '
      } `}
      onClick={onClick}
      disabled={!enabled}
    >
      <svg className="h-5 w-5 text-white" viewBox="137.718 -1.001 366.563 644">
        <path
          fill={enabled ? `#FFFFFF` : '#898989'}
          d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z"
        />
      </svg>
    </button>
  );
};

const NextButton = (props) => {
  const { enabled, onClick } = props;

  return (
    <button
      className={` z-50 h-5 w-5  ${
        enabled ? 'cursor-pointer' : 'cursor-not-allowed '
      } `}
      onClick={onClick}
      disabled={!enabled}
    >
      <svg className="h-5 w-5 text-white " viewBox="0 0 238.003 238.003">
        <path
          fill={enabled ? `#FFFFFF` : '#898989'}
          d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z"
        />
      </svg>
    </button>
  );
};
export const EmblaCarousel = ({ children, style = null, autoplay = false }) => {
  const [mainViewportRef, embla] = useEmblaCarousel(
    {
      skipSnaps: false,
      slidesToScroll: 'auto',
    },
    autoplay ? [Autoplay()] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  return (
    <div className="flex w-full flex-col gap-4 ">
      <div className="relative flex h-full w-full items-center ">
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <div className="w-full overflow-hidden" ref={mainViewportRef}>
          <div className=" -ml-2 flex h-full w-full touch-none select-none gap-x-6">
            {children?.map((slide, index) => {
              return (
                <div
                  key={index}
                  className="relative h-full w-full cursor-grab pl-4"
                >
                  {slide}
                </div>
              );
            })}
          </div>
        </div>
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
      </div>

      <div className="relative mx-auto mt-1 w-full pt-0">
        {/*max-w-[670px]*/}
        <div
          className=" w-full cursor-grabbing overflow-hidden  "
          //   ref={thumbViewportRef}
        >
          <div className="flex w-full cursor-default select-none items-center justify-center gap-2">
            {scrollSnaps?.length > 1 &&
              scrollSnaps?.map((_, index) => {
                return (
                  <Thumb
                    onClick={() => scrollTo(index)}
                    selected={index === selectedIndex}
                    style={style}
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
