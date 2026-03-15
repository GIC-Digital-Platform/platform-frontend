import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * Reusable page header with title and optional action button.
 */
const PageHeader = ({ title, buttonLabel, onButtonClick }) => (
  <div className="page-header">
    <h1 className="page-title">{title}</h1>
    {buttonLabel && (
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onButtonClick}
        size="large"
      >
        {buttonLabel}
      </Button>
    )}
  </div>
);

export default PageHeader;
