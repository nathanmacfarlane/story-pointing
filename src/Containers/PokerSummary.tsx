import React, { useState } from 'react';
import { TitleAndBody } from '../Components/TitleAndBody';
import { Summary, Vote } from '../Components/Summary';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Firebase } from '../Firebase/firebase';
import { useRedirectToLanding } from '../Hooks/hooks';

export const PokerSummary = ({ room }: { room?: any }) => {
  const { id } = useParams() as any;
  const story = room?.activeStory || room?.storyNames[0];
  const [votes, setVotes] = useState<Vote[]>([]);

  useRedirectToLanding();

  useEffect(() => {
    if (id && room?.activeStory) {
      const store = new Firebase();
      store.listenToVotesOnRoomsStory(id, room?.activeStory, (rawVotes) => {
        store.fetchUsers(
          rawVotes.map((response) => response.userId),
          (users) => {
            const votes = rawVotes.map((rawVote) => {
              const user = users.filter(
                (user) => user.id === rawVote.userId
              )[0];
              const points = rawVote.value;
              return { player: user, points };
            });
            setVotes(votes);
          }
        );
      });
    }
  }, [id, room?.activeStory]);
  return (
    <>
      <TitleAndBody
        nextButton={{
          text: 'Next Story',
          onClick: () => {
            const store = new Firebase();
            const indexOfCurrentStory = room?.storyNames.indexOf(story);
            if (indexOfCurrentStory + 1 < room?.storyNames.length) {
              // more stories exist
              const nextStory = room?.storyNames[indexOfCurrentStory + 1];
              console.log(nextStory);
              store.setActivePage(id, 'POKER', nextStory);
            } else {
              // this was the last story
              store.setActivePage(id, 'EPIC', undefined);
            }
          },
        }}
        isLoading={!votes}
        title={story}
        body={
          <div
            style={{
              backgroundColor: '#12181F',
              padding: 15,
              marginTop: 10,
              minWidth: 600,
              maxWidth: 800,
            }}
          >
            <Summary votes={votes} />
          </div>
        }
      />
    </>
  );
};
