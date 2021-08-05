import { Row, Col, message } from 'antd';
import firebase from 'firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import { Firebase } from '../Firebase/firebase';
import Checkbox from '../Images/CheckBox.png';
const OPTIONS = ['1/2', '1', '2', '3', '5', '8', '13', '20', '40', '?'];

const Option = ({
  option,
  onClick,
  isSelected,
}: {
  option: string;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <div
      className={'noselect'}
      style={{
        fontSize: '1.5em',
        backgroundColor: '#E6E6E6',
        color: 'black',
        textAlign: 'center',
        height: '100px',
        width: '100px',
        lineHeight: '100px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {isSelected ? (
        <img
          height='30'
          style={{ top: 35, position: 'relative' }}
          src={Checkbox}
        />
      ) : (
        option
      )}
    </div>
  );
};

export const Voting = ({
  roomId,
  storyName,
}: {
  roomId: string;
  storyName: string;
}) => {
  const [selected, setSelected] = useState<string>();

  const userId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    if (storyName) {
      const store = new Firebase();
      store.listenToVotesOnRoomsStory(roomId, storyName, (votes) => {
        const usersVotes = votes.filter((vote) => vote.userId === userId);
        if (usersVotes.length > 0) {
          const voteValue = usersVotes[0].value;
          setSelected(voteValue >= 1 ? `${voteValue}` : '1/2');
        } else {
          setSelected(undefined);
        }
      });
    }
  }, [storyName]);

  return (
    <div>
      <Row justify='space-around' gutter={[16, 16]}>
        {OPTIONS.map((option) => (
          <Col key={option} span={4.8}>
            <Option
              option={option}
              onClick={() => {
                if (userId) {
                  const store = new Firebase();
                  setSelected(selected === option ? undefined : option);
                  store.createVote(
                    userId,
                    roomId,
                    storyName,
                    parseFloat(option === '1/2' ? '0.5' : option),
                    (voteId) => console.log('voteId: ', voteId)
                  );
                } else {
                  message.error('Unable to vote without an account.');
                }
              }}
              isSelected={selected === option}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};
