import { Firebase } from '../Firebase/firebase';
import { useIsAdmin } from '../Hooks/hooks';

export const StoryList = ({
  stories,
  activeStory,
  roomId,
}: {
  roomId?: string;
  stories: string[];
  activeStory: string;
}) => {
  const { isAdmin } = useIsAdmin(roomId);
  return (
    <div
      style={{
        padding: 20,
        position: 'fixed',
        left: 0,
        top: '50%',
        backgroundColor: '#12181F',
        transform: 'translateY(-50%)',
      }}
    >
      {stories?.map((story) => {
        return (
          <div
            key={story}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                color: 'white',
                cursor: isAdmin ? 'pointer' : undefined,
                fontWeight: activeStory === story ? 'bold' : 'normal',
              }}
              onClick={
                isAdmin
                  ? () => {
                      const store = new Firebase();
                      if (roomId) {
                        store.setActivePage(roomId, 'POKER', story);
                      }
                    }
                  : undefined
              }
            >
              {story}
            </h3>
          </div>
        );
      })}
    </div>
  );
};
