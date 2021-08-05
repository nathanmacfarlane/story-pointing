import { useHistory, useLocation } from 'react-router-dom';
import { SimpleButton } from '../Components/SimpleButton';
import { Firebase } from '../Firebase/firebase';
import { useIsAdmin } from '../Hooks/hooks';

export const CloseButton = ({
  roomId,
  room,
}: {
  roomId?: string;
  room?: any;
}) => {
  const { pathname } = useLocation();
  const { goBack, push } = useHistory();
  const { isAdmin } = useIsAdmin(roomId);
  if (!isAdmin) {
    return <></>;
  }
  return pathname === '/create-user' ? (
    <div style={{ position: 'fixed', top: 10, left: 10, padding: 20 }}>
      <SimpleButton title='Back' onClick={goBack} />
    </div>
  ) : pathname.split('/').length === 3 && room?.activePage === 'EPIC' ? (
    <div style={{ position: 'fixed', top: 10, left: 10, padding: 20 }}>
      <SimpleButton title='Exit' onClick={() => push('/')} />
    </div>
  ) : pathname.split('/').length === 3 && room?.activePage === 'POKER' ? (
    <div style={{ position: 'fixed', top: 10, left: 10, padding: 20 }}>
      <SimpleButton
        title='Close'
        onClick={() => {
          if (roomId) {
            const store = new Firebase();
            store.setActivePage(roomId, 'EPIC', undefined);
          }
        }}
      />
    </div>
  ) : (
    <></>
  );
};
