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
  margin-bottom: 20px;

  flex-shrink: 0; // prevents Safari freaking out
`;

const Code = styled.span`
  color: #ffcf40;
  cursor: text;
  user-select: text;
`;

// N.B. In iOS Safari, the button text isn't perfectly vertically centered when the button
// sheight is small, so keep it above 24px
const CustomButton = styled(Button)`
  height: 24px;

  font-size: 13px;
  margin-bottom: 0;

  padding-left: 5px;
  padding-right: 5px;

  border-style: solid;
  border-width: 1px;
  border-radius: 4px;

  &:hover,
  &:active {
    border-width: 1px;
    border-style: solid;
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
        Game code: <Code>{gameCode}</Code>
      </Text>
      <CopyToClipboard text={gameCode} onCopy={() => setIsCopied(true)}>
        <CustomButton>{isCopied ? '✅ Copied.' : 'Copy'}</CustomButton>
      </CopyToClipboard>
    </Container>
  );
};

export default GameCode;
