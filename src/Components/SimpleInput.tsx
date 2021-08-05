import { Input } from 'antd';
import React from 'react';

export const SimpleInput = ({
  title,
  placeholder,
  largeText,
  onValueChange,
}: {
  title?: string;
  placeholder?: string;
  largeText?: boolean;
  onValueChange?: (value: string) => void;
}) => {
  return (
    <>
      {title && <h3 style={{ color: '#ccc' }}>{title}</h3>}
      <Input
        onChange={(e: any) => {
          if (onValueChange) {
            onValueChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        style={{
          backgroundColor: '#12181F',
          borderColor: 'gray',
          height: 40,
          color: 'white',
          fontSize: largeText ? 25 : 16,
          width: 220,
        }}
      />
    </>
  );
};
