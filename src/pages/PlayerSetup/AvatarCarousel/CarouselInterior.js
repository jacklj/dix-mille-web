import React, { useEffect, useState, useContext } from 'react';
import styled, { css } from 'styled-components';

import {
  Slider,
  Slide,
  CarouselContext,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import AvatarSlide from './AvatarSlide';
import { Button } from 'components/forms';
import carouselButtonCss from './carouselButtonCss';

const buttonCustomCss = css`
  margin: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 0;
  padding-bottom: 0;
`;

const StyledButtonBack = styled(ButtonBack)`
  ${carouselButtonCss}
  ${buttonCustomCss}
`;

const StyledButtonNext = styled(ButtonNext)`
  ${carouselButtonCss}
  ${buttonCustomCss}
`;

// We need this component to use the CarouselContext to get the current slide from
// pure-react-carousel a bit cumbersome :/

const CarouselInterior = ({ avatars, onAvatarSelected }) => {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(
    carouselContext.state.currentSlide,
  );
  useEffect(() => {
    function onChange() {
      if (currentSlide !== carouselContext.state.currentSlide) {
        setCurrentSlide(carouselContext.state.currentSlide);
        onAvatarSelected(carouselContext.state.currentSlide);
      }
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext, currentSlide, onAvatarSelected]);

  return (
    <>
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
      <StyledButtonBack>{'<'}</StyledButtonBack>
      <StyledButtonNext>{'>'}</StyledButtonNext>
    </>
  );
};

export default CarouselInterior;
