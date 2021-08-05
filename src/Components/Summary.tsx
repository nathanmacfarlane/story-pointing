import { Row, Col } from 'antd';
import { Player } from './PlayerList';
import { Emoji } from 'emoji-mart';
import { DonutChart } from './DonutChart';

export interface Vote {
  player: Player;
  points: number;
}

const groupByVote = (votes: Vote[]) => {
  const groupedByVote: { [key: number]: Player[] } = {};
  for (const vote of votes) {
    const existing = groupedByVote[vote.points];
    if (existing) {
      groupedByVote[vote.points] = [...existing, vote.player];
    } else {
      groupedByVote[vote.points] = [vote.player];
    }
  }
  return groupedByVote;
};

export const Summary = ({ votes }: { votes: Vote[] }) => {
  const groupedByVote = groupByVote(votes);
  const values = Object.keys(groupedByVote).map((key) => parseInt(key));
  return (
    <>
      <Row justify='space-around' align='middle'>
        <Col>
          {Object.keys(groupedByVote).map((points: any, index) => (
            <Row key={points}>
              <div
                style={{
                  color: 'black',
                  borderRadius: 3,
                  backgroundColor: '#E6E6E6',
                  padding: '0 20px 0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom:
                    index === Object.keys(groupedByVote).length - 1 ? 0 : 10,
                }}
              >
                <h2 style={{ paddingRight: 5, lineHeight: '50px', margin: 0 }}>
                  {points}
                </h2>
                {groupedByVote[points].map((player) => (
                  <Emoji
                    emoji={player.emoji}
                    skin={player.skinTone}
                    size={40}
                  />
                ))}
              </div>
            </Row>
          ))}
        </Col>
        <Col>
          <DonutChart values={values} />
        </Col>
      </Row>
    </>
  );
};
