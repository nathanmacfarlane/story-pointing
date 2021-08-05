import { message } from 'antd';
import { Emoji } from 'emoji-mart';
import { useEffect, useState } from 'react';
import { Firebase } from '../Firebase/firebase';

type SkinTone = 1 | 2 | 3 | 4 | 5 | 6;

export interface Player {
  emoji: string;
  skinTone: SkinTone;
  name: string;
  id: string;
}

export const PlayerList = ({
  users,
  roomId,
  room,
}: {
  users?: Player[];
  roomId?: string;
  room?: any;
}) => {
  const [userCache, setUserCache] = useState<Player[]>();
  const [voterIds, setVoterIds] = useState<string[]>([]);
  useEffect(() => {
    setUserCache(users);
    if (userCache && users && userCache.length !== users.length) {
      users.forEach((newUser) => {
        const contains = userCache.filter(
          (userCache) =>
            userCache.name === newUser.name && userCache.emoji === newUser.emoji
        );
        if (contains.length === 0) {
          message.info(`${newUser.name} joined.`);
        }
      });
    }
  }, [users]);

  useEffect(() => {
    if (room?.activeStory && roomId && room?.activePage === 'POKER') {
      const store = new Firebase();
      store.listenToVotesOnRoomsStory(roomId, room?.activeStory, (data) => {
        const usersThatVoted = data.map((vote) => vote.userId);
        setVoterIds(usersThatVoted);
      });
    }
  }, [room?.activeStory, roomId]);

  return (
    <div
      style={{
        padding: 20,
        position: 'fixed',
        right: 0,
        top: '50%',
        backgroundColor: '#12181F',
        transform: 'translateY(-50%)',
      }}
    >
      {users?.map(({ emoji, name, skinTone, id }) => {
        return (
          <div
            key={id}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {room?.activePage === 'POKER' && (
              <div
                style={{
                  backgroundColor: voterIds.includes(id) ? 'green' : 'red',
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              />
            )}
            <Emoji emoji={emoji} skin={skinTone} size={30} />
            <h3 style={{ color: 'white', paddingLeft: 20 }}>{name}</h3>
          </div>
        );
      })}
    </div>
  );
};
