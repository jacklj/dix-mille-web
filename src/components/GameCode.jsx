import React, { useState } from 'react';
import 'firebase/functions';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { selectGameCode } from 'redux/game/selectors';
import { Button } from 'components/forms';

const Container = styled.div`
  align-self: center; // just this component is "align-items centered" within the parent
  display: flex;
  align-items: baseline;
  margin-bottom: 40px;
`;

const Yellow = styled.span`
  color: #ffcf40;
`;

const CustomButton = styled(Button)`
  font-size: 0.8em;
  margin-bottom: 0;

  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 5px;
  padding-right: 5px;

  border-width: 1px;
  border-radius: 4px;

  &:hover,
  &:active {
    border-width: 1px;
  }
`;

const Text = styled.div`
  margin-right: 5px;
  font-size: 1.2em;
`;

const GameCode = () => {
  const gameCode = useSelector(selectGameCode);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Container>
      <Text>
        Game code: <Yellow>{gameCode}</Yellow>
      </Text>
      <CopyToClipboard text={gameCode} onCopy={() => setIsCopied(true)}>
        <CustomButton>{isCopied ? '✅ Copied.' : 'Copy'}</CustomButton>
      </CopyToClipboard>
    </Container>
  );
};

export default GameCode;
