import styled from 'styled-components';

const ArtDecoButton = styled.button`
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: transparent;
  border: 6px double rgb(180, 176, 85);
  border-radius: 50px;
  margin-bottom: 40px;

  color: rgb(180, 176, 85);
  font-family: 'Playfair Display', serif;
  font-size: 1.7em;
  letter-spacing: 0.5px;
  font-weight: 700;
  text-transform: uppercase;

  &:hover {
    border: 6px double #ffcf40;
    color: #ffcf40;
  }
  &:active {
    border: 6px double #ffbf00;
    color: #ffbf00;
  }
`;

export default ArtDecoButton;
