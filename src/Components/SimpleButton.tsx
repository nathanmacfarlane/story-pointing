import { Button, ButtonProps } from 'antd';
import React from 'react';

export const SimpleButton = ({
  color,
  title,
  fontSize,
  buttonProps,
  disabled,
  onClick,
}: {
  title: string;
  color?: string;
  fontSize?: number;
  disabled?: boolean;
  buttonProps?: ButtonProps;
  onClick?: () => void;
}) => {
  return (
    <Button
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: color || 'white',
        padding: 0,
        margin: 0,
        fontSize: fontSize || 24,
      }}
      disabled={disabled}
      {...buttonProps}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};
