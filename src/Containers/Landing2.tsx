import { useState } from 'react';
import { message, Tabs } from 'antd';
import { SimpleInput } from '../Components/SimpleInput';
import { Collection, Firebase } from '../Firebase/firebase';
import { SimpleButton } from '../Components/SimpleButton';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';

const { TabPane } = Tabs;

export const Landing = ({
  setRoomId,
}: {
  setRoomId: (roomId: string) => void;
}) => {
  const { push } = useHistory();
  return (
    <div>
      <h1 style={{ color: 'white' }}>Welcome!</h1>
      <Tabs defaultActiveKey='join'>
        <TabPane tab='Join' key='join'>
          <Join push={push} setRoomId={setRoomId} />
        </TabPane>
        <TabPane tab='Create' key='create'>
          <Create push={push} setRoomId={setRoomId} />
        </TabPane>
      </Tabs>
    </div>
  );
};

const Join = ({
  push,
  setRoomId,
}: {
  push: (url: string) => void;
  setRoomId: (roomId: string) => void;
}) => {
  const [roomId, formRoomId] = useState<string>();
  return (
    <>
      <SimpleInput title='Room Id' onValueChange={formRoomId} />
      <br />
      <br />
      <SimpleButton
        fontSize={16}
        disabled={!roomId}
        title='Join Room'
        onClick={() => {
          const userId = firebase.auth().currentUser?.uid;
          const store = new Firebase();
          store.roomExists(roomId!, (exists) => {
            if (exists) {
              setRoomId(roomId!);
              push(userId ? `/room/${roomId}` : '/create-user');
            } else {
              message.error(`Room does not exist with id ${roomId!}`);
            }
          });
        }}
      />
    </>
  );
};

const Create = ({
  push,
  setRoomId,
}: {
  push: (url: string) => void;
  setRoomId: (roomId: string) => void;
}) => {
  const [epicTitle, setEpicTitle] = useState<string>();
  const [stories, setStories] = useState<string>();
  return (
    <>
      <SimpleInput title='Epic Title' onValueChange={setEpicTitle} />
      <br />
      <br />
      <SimpleInput
        title='Stories'
        placeholder='comma seperated'
        onValueChange={setStories}
      />
      <br />
      <br />
      <SimpleButton
        fontSize={16}
        disabled={!epicTitle || !stories}
        title='Create Room'
        onClick={() => {
          const userId = firebase.auth().currentUser?.uid;
          const store = new Firebase();
          const splitStories = stories!.split(',').map((str) => str.trim());
          store.createRoom(epicTitle!, splitStories, [], userId, (roomId) => {
            setRoomId(roomId);
            push(userId ? `/room/${roomId}` : '/create-user');
          });
        }}
      />
    </>
  );
};
