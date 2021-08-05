import React from 'react';
import { TitleAndBody } from '../Components/TitleAndBody';
import { Voting } from '../Components/Voting';
import { useParams } from 'react-router-dom';
import { Firebase } from '../Firebase/firebase';
import { useRedirectToLanding } from '../Hooks/hooks';
import { Countdown } from '../Components/Countdown';

export const PokerVoting = ({ room }: { room?: any }) => {
  const { id } = useParams() as any;
  const story = room?.activeStory || room?.storyNames[0];
  useRedirectToLanding();
  return (
    <>
      <TitleAndBody
        title={story}
        isLoading={!room}
        backButtonOnClick={() => {
          const store = new Firebase();
          store.setActivePage(id, 'EPIC', undefined);
        }}
        nextButton={{
          text: 'View Results',
          onClick: () => {
            const store = new Firebase();
            store.setActivePage(id, 'SUMMARY', story);
          },
        }}
        body={
          <div
            style={{
              backgroundColor: '#12181F',
              padding: 15,
              marginTop: 10,
              width: 600,
            }}
          >
            <Voting roomId={id} storyName={story} />
          </div>
        }
      />
    </>
  );
};
