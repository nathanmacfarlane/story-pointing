import React from 'react';
import { TitleAndBody } from '../Components/TitleAndBody';
import { useHistory, useParams } from 'react-router-dom';
import { Firebase } from '../Firebase/firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import firebase from 'firebase';
import { useIsAdmin, useRedirectToLanding } from '../Hooks/hooks';

export const Poker = ({ room }: { room?: any }) => {
  const { id } = useParams() as any;
  const { push } = useHistory();
  const epicName: string = room?.epicName;
  const storyNames: string[] = room?.storyNames;
  const [storyPoints, setStoryPoints] =
    useState<{ [storyName: string]: number }>();

  useRedirectToLanding();

  const { isAdmin } = useIsAdmin(id);

  useEffect(() => {
    const store = new Firebase();
    store.listenToVotes(id, (votes) => {
      const sums: { [storyName: string]: [number, number] } = {}; // count, sum
      votes.forEach((vote) => {
        sums[vote.storyName] = [
          (sums[vote.storyName]?.[0] || 0) + 1,
          (sums[vote.storyName]?.[1] || 0) + vote.value,
        ];
      });
      const keys = Object.keys(sums);
      const averages: { [storyName: string]: number } = {};
      keys.forEach((key) => {
        const value = sums[key];
        averages[key] = Math.round(value[1] / value[0]);
      });
      setStoryPoints(averages);
    });
  }, []);

  return (
    <>
      <TitleAndBody
        title={epicName}
        isLoading={!room}
        backButtonOnClick={() => push('/')}
        body={storyNames?.map((story) => {
          const points: number | undefined = storyPoints?.[story];
          return (
            <div
              key={story}
              style={{
                backgroundColor: '#12181F',
                padding: 15,
                marginTop: 10,
                width: 600,
                cursor: isAdmin ? 'pointer' : undefined,
              }}
              onClick={
                isAdmin
                  ? () => {
                      const store = new Firebase();
                      store.setActivePage(id, 'POKER', story);
                    }
                  : undefined
              }
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3 style={{ color: 'white' }}>{story}</h3>
                <span style={{ fontWeight: 'bold', fontSize: '3em' }}>
                  {points}
                </span>
              </div>
            </div>
          );
        })}
      />
    </>
  );
};
