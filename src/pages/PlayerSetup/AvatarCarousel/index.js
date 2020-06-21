import React from 'react';
import styled from 'styled-components';

import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import AvatarSlide from './AvatarSlide';

const Button = styled.button`
  margin: 20px;
`;

const CarouselContainer = styled.div`
  margin: 20px;
`;

const AvatarCarousel = ({
  avatars,
  currentAvatar,
  previousAvatar,
  nextAvatar,
}) => {
  return (
    <CarouselContainer>
      {avatars && avatars.length > 0 && (
        <CarouselProvider
          naturalSlideWidth={200}
          naturalSlideHeight={250}
          totalSlides={avatars.length}
          currentSlide={currentAvatar}
          infinite>
          <Slider style={{ height: '200px' }}>
            {avatars.map((avatar, key) => (
              <Slide index={key} key={avatar.url}>
                <AvatarSlide
                  url={avatar.url}
                  alreadyChosen={avatar.alreadyChosen}
                />
              </Slide>
            ))}
          </Slider>
          <Button onClick={(e) => previousAvatar(e)}>{'<'}</Button>
          <Button onClick={(e) => nextAvatar(e)}>{'>'}</Button>
        </CarouselProvider>
      )}
    </CarouselContainer>
  );
};

export default AvatarCarousel;
