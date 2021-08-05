import { Col, Row, Tooltip } from 'antd';
import { Emoji } from 'emoji-mart';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SimpleButton } from '../Components/SimpleButton';
import { SimpleInput } from '../Components/SimpleInput';
import { Firebase, useFetchUsers, useListenToRoom } from '../Firebase/firebase';

const SKIN_TONES = [
  '#DDAD42',
  '#F0C8A6',
  '#DEB593',
  '#AD815C',
  '#7E522E',
  '#000000',
];

const CHARACTERS = [
  'santa',
  'vampire',
  'judge',
  'astronaut',
  'cop',
  'artist',
  'farmer',
  'technologist',
  'scientist',
  'mage',
  'elf',
  'zombie',
  'genie',
  'merperson',
  'fairy',
  'singer',
  'guardsman',
  'superhero',
  'pilot',
  'cook',
  'student',
  'mechanic',
  'firefighter',
  'juggling',
];

const CHARACTER_ROWS = [
  CHARACTERS.slice(0, 8),
  CHARACTERS.slice(8, 16),
  CHARACTERS.slice(16, 24),
];

const SWATCH_SIZE = 35;
const CHARACTER_SIZE = 50;

export type SkinTone = 1 | 2 | 3 | 4 | 5 | 6;

export const CreateUser = ({
  room,
  roomId,
}: {
  room?: any;
  roomId?: string;
}) => {
  const { push } = useHistory();
  const [skinTone, setSkinTone] = useState<number>(1);
  const [emoji, setEmoji] = useState<string>();
  const [name, setName] = useState<string>();

  return (
    <div>
      <h1 style={{ color: 'white' }}>
        Before you join, please chose a character.
      </h1>
      <ChoseCharacter
        skinToneChanged={setSkinTone}
        emojiChanged={setEmoji}
        nameChanged={setName}
        roomId={roomId}
      />
      <br />
      <br />
      <SimpleButton
        title='Join Room'
        disabled={!skinTone || !emoji || !name || !room}
        onClick={() => {
          const store = new Firebase();
          store.createUser(name!, emoji!, skinTone!, (userId) => {
            store.addUserToRoom(room!.id, userId, (roomId) => {
              push(`/room/${roomId}`);
            });
          });
        }}
      />
    </div>
  );
};

const ChoseCharacter = ({
  skinToneChanged,
  emojiChanged,
  nameChanged,
  roomId,
}: {
  skinToneChanged: (tone: number) => void;
  emojiChanged: (emoji?: string) => void;
  nameChanged: (name?: string) => void;
  roomId?: string;
}) => {
  const [skinTone, setSkinTone] = useState<SkinTone>(1);
  return (
    <div>
      <div style={{ display: 'flex', padding: '10px 0px' }}>
        {SKIN_TONES.map((tone, index) => (
          <div
            key={`skin-tone-${tone}`}
            style={{
              backgroundColor: tone,
              height: SWATCH_SIZE,
              width: SWATCH_SIZE,
              borderRadius: 26,
              border: index + 1 == skinTone ? '2px solid white' : '',
              marginLeft: `${index > 0 ? 10 : 0}px`,
              cursor: 'pointer',
            }}
            onClick={() => {
              if (index + 1 <= 6 && index + 1 >= 1) {
                const newTone = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
                setSkinTone(newTone);
                skinToneChanged(newTone);
              }
            }}
          />
        ))}
      </div>
      <br />
      <Emojis skinTone={skinTone} emojiChanged={emojiChanged} roomId={roomId} />
      <br />
      <SimpleInput title={'Name'} onValueChange={nameChanged} />
    </div>
  );
};

const Emojis = ({
  skinTone,
  emojiChanged,
  roomId,
}: {
  skinTone: SkinTone;
  emojiChanged: (emoji?: string) => void;
  roomId?: string;
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [emoji, setEmoji] = useState<string>();

  const { room } = useListenToRoom(roomId);

  useEffect(() => {
    if (room) {
      const store = new Firebase();
      store.fetchUsers(room.userIds, setUsers);
    }
  }, [room]);

  const selectedCharacters = users.map((user) => user.emoji);

  return (
    <div style={{ backgroundColor: '#12181F', padding: 10 }}>
      {CHARACTER_ROWS.map((characters, index) => (
        <Row key={`character-row-${index}`} gutter={[0, 0]}>
          {characters.map((character) => {
            const isSelected = selectedCharacters.includes(character);
            const name = isSelected
              ? users.filter((user) => user.emoji === character)[0].name
              : undefined;
            return (
              <Col
                onClick={
                  isSelected
                    ? undefined
                    : () => {
                        setEmoji(character);
                        emojiChanged(character);
                      }
                }
                className={`emoji-character ${
                  emoji === character ? 'emoji-character-selected' : ''
                }`}
                style={{
                  cursor: isSelected ? undefined : 'pointer',
                  backgroundColor: isSelected ? 'gray' : undefined,
                  borderRadius: 8,
                }}
                key={character}
                span={3}
              >
                {isSelected ? (
                  <Tooltip title={name}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 75,
                      }}
                    >
                      <Emoji
                        emoji={character}
                        skin={skinTone}
                        size={CHARACTER_SIZE}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 75,
                    }}
                  >
                    <Emoji
                      emoji={character}
                      skin={skinTone}
                      size={CHARACTER_SIZE}
                    />
                  </div>
                )}
              </Col>
            );
          })}
        </Row>
      ))}
    </div>
  );
};
