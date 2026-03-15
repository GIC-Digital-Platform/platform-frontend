import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * Reusable page header with title and optional action button.
 */
const PageHeader = ({ title, buttonLabel, onButtonClick }) => (
  <div className="page-top">
    <h1 className="page-title">{title}</h1>
    {buttonLabel && (
      <Button className="btn-primary" icon={<PlusOutlined />} onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    )}
  </div>
);

export default PageHeader;
