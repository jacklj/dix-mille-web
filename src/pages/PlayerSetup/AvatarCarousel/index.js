import React from 'react';
import styled from 'styled-components';
import { CarouselProvider } from 'pure-react-carousel';

import CarouselInterior from './CarouselInterior';

const CarouselContainer = styled.div`
  margin-bottom: 30px;
`;

const AvatarCarousel = ({ avatars, onAvatarSelected }) => {
  return (
    <CarouselContainer>
      {avatars && avatars.length > 0 && (
        <CarouselProvider
          naturalSlideWidth={200}
          naturalSlideHeight={250}
          totalSlides={avatars.length}
          currentSlide={0} // badly named prop - it's actually the initial slide.
          infinite>
          <CarouselInterior
            avatars={avatars}
            onAvatarSelected={onAvatarSelected}
          />
        </CarouselProvider>
      )}
    </CarouselContainer>
  );
};

export default AvatarCarousel;
