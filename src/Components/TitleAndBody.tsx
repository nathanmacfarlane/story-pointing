import React, { ReactElement } from 'react';
import { BackButton } from '../Components/BackButton';
import { SimpleButton } from './SimpleButton';
import { LoadingOutlined } from '@ant-design/icons';
import { useIsAdmin } from '../Hooks/hooks';
import { useParams } from 'react-router-dom';

export const TitleAndBody = ({
  title,
  body,
  nextButton,
  isLoading,
  backButtonOnClick,
  subTitle,
}: {
  title: string;
  subTitle?: ReactElement<any, any>;
  body?: JSX.Element | JSX.Element[];
  isLoading?: boolean;
  backButtonOnClick?: () => void;
  nextButton?: { text: string; onClick: () => void };
}) => {
  const { id } = useParams() as any;
  const { isAdmin } = useIsAdmin(id);
  return (
    <>
      <BackButton onClick={backButtonOnClick} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        {isLoading ? (
          <LoadingOutlined />
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h1 style={{ color: 'white', fontSize: 45 }}>{title}</h1>
              {subTitle}
            </div>
            {body}
            {nextButton && isAdmin && (
              <div style={{ float: 'right' }}>
                <SimpleButton
                  title={nextButton.text}
                  fontSize={16}
                  onClick={nextButton.onClick}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
