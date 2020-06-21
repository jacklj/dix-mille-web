import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/database';

import { selectBotDetails } from 'redux/definitions/selectors';
import {
  selectGameId,
  selectGivenMessageResponse,
  selectPageId,
  selectRole,
} from 'redux/game/selectors';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BotAvatar = styled.img`
  height: 40px;
  width: auto;
  margin-right: 7px;
`;

const ContentContainer = styled.div``;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const Name = styled.div`
  color: white;
  margin-right: 15px;
`;

const Text = styled.div`
  color: white;
`;

const SendTime = styled.div`
  color: white;
  font-size: 0.7em;
  margin-left: 10px;
`;

const Message = ({ text, sender, timeSent, responses, messageId }) => {
  const botDetails = useSelector(selectBotDetails(sender));
  const gameId = useSelector(selectGameId);
  const pageId = useSelector(selectPageId);
  const role = useSelector(selectRole);

  const givenResponse = useSelector(
    selectGivenMessageResponse({ role, messageId }),
  );

  console.log(
    `page ${pageId}/message ${messageId}/ role ${role}] Message response: ${givenResponse} `,
  );

  const { name, avatarUrl } = botDetails;

  const prettyTimeSent = timeSent.fromNow(true); // https://momentjs.com/docs/#/displaying/fromnow/

  const sendResponse = async (responseId) => {
    console.log(
      `[Page ${pageId}/Message ${messageId}] Response ${responseId} sent.`,
    );

    // if message response has no immediate side effects (namely, has no scoreModifers), can just
    // write it to the DB.
    // If it has side effects, we don't want the client to have permissions to write directly to scores,
    // so let's call a cloud function (that will get the score modifiers )

    try {
      await firebase // use await so we can catch the error here
        .database()
        .ref(
          `games/${gameId}/currentPage/messageResponses/${messageId}/${role}`,
        )
        .set({
          responseId,
          pageId,
          sentTime: firebase.database.ServerValue.TIMESTAMP,
        });
    } catch (error) {
      // probably a permission denied error because the user replied to a message at the very last moment,
      // when the DB had already updated the current page to be the next page, but the client hadn't received
      // the data update yet. So it tried to write the message response to the wrong page, and the DB validation
      // rules denied the write.
      console.error(error);
      // TODO JLJ 1/06/2020 report this to e.g. Sentry
    }
  };

  const hasAResponseBeenGiven = typeof givenResponse === 'number';

  return (
    <Container>
      {avatarUrl && <BotAvatar src={avatarUrl} />}
      <ContentContainer>
        <TextContainer>
          <Name>{name}</Name>
          <Text>{text}</Text>
          <SendTime>{prettyTimeSent}</SendTime>
        </TextContainer>
        {responses && (
          <TextContainer>
            {responses.map((
              responseObj,
              responseId, // response id is just the array index
            ) => (
              <button
                key={responseObj.text}
                onClick={() => sendResponse(responseId)}
                disabled={hasAResponseBeenGiven}>
                {`${givenResponse === responseId ? '✅' : ''}${
                  responseObj.text
                }`}
              </button>
            ))}
          </TextContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

export default Message;
