import { SimpleButton } from './SimpleButton';

export const BackButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div style={{ position: 'fixed', top: 30, left: 30 }}>
      <SimpleButton title='BACK' fontSize={16} onClick={onClick} />
    </div>
  );
};
