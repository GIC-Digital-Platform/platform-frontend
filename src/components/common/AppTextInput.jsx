import React from 'react';
import { Form, Input } from 'antd';

/**
 * Reusable text input component that wraps Ant Design Form.Item + Input/TextArea.
 * Consistent styling across the application.
 */
const AppTextInput = ({
  name,
  label,
  rules = [],
  type = 'text',
  placeholder,
  disabled = false,
  rows = 4,
  ...rest
}) => (
  <Form.Item name={name} label={label} rules={rules}>
    {type === 'textarea' ? (
      <Input.TextArea
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        style={{ resize: 'none' }}
        {...rest}
      />
    ) : (
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
    )}
  </Form.Item>
);

export default AppTextInput;
