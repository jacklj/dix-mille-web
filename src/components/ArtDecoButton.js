import styled from 'styled-components';

const ArtDecoButton = styled.button`
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: rgba(48, 25, 53, 0.9);
  border: 2px solid #ffbf00;
  border-style: double;
  border-radius: 50px;
  margin-bottom: 40px;
  box-shadow: 0 0 0 2px rgba(48, 25, 53, 0.9), 0 0 0 4px #ffbf00;

  color: #ffbf00;
  font-family: 'Poiret One', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  font-size: 1.3em;
  text-transform: uppercase;
  text-shadow: 0px -4px 5px #000000;

  &:active {
    background-color: rgb(200, 50, 50);
  }
`;

export default ArtDecoButton;
