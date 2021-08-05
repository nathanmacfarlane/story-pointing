import './App.css';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Landing } from './Containers/Landing2';
import { CreateUser } from './Containers/CreateUser';
import { useState } from 'react';
import { useEffect } from 'react';
import { Firebase, useFetchUsers } from './Firebase/firebase';
import { Poker } from './Containers/Poker';
import { PokerVoting } from './Containers/PokerVoting';
import { PokerSummary } from './Containers/PokerSummary';
import { PlayerList } from './Components/PlayerList';
import { StoryList } from './Components/StoryList';
import { CloseButton } from './Containers/CloseButton';

const App = () => {
  const { pathname } = useLocation();
  const [room, setRoom] = useState<any>();
  const [roomId, setRoomId] = useState<string>();
  const { users } = useFetchUsers(room?.userIds);

  useEffect(() => {
    if (pathname.split('/')[2]) {
      setRoomId(pathname.split('/')[2]);
    }
  }, [pathname]);

  useEffect(() => {
    // init app
    Firebase.Instance.getApp();
    // listen to room
    if (roomId) {
      const store = new Firebase();
      store.listenToRoom(roomId, (room) => setRoom(room));
    }
  }, [roomId]);

  const story = room?.activeStory || room?.storyNames[0];

  return (
    <>
      <CloseButton roomId={roomId} room={room} />
      {pathname !== '/' && pathname !== '/create-user' && (
        <PlayerList users={users} roomId={roomId} room={room} />
      )}
      {pathname.split('/').length === 3 && room?.activePage !== 'EPIC' && (
        <StoryList
          activeStory={story}
          stories={room?.storyNames || []}
          roomId={roomId}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          WebkitTransform: 'translate(-50%, -50%)',
          transform: 'translate(-50%, -50%)',
          height: pathname === '/' ? 300 : undefined,
        }}
      >
        <Switch>
          <Route path='/create-user'>
            <CreateUser room={room} roomId={roomId} />
          </Route>
          <Route path='/room/:id'>
            {!room ? (
              <>Loading</>
            ) : room?.activePage === 'EPIC' ? (
              <Poker room={room} />
            ) : room?.activePage === 'POKER' ? (
              <PokerVoting room={room} />
            ) : (
              <PokerSummary room={room} />
            )}
          </Route>
          <Route path='/'>
            <Landing setRoomId={setRoomId} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
