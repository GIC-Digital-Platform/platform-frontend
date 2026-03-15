import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, message, Spin, Alert, Space } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import PageHeader from '../../components/common/PageHeader';
import CafeLogoCell from '../../components/cafes/CafeLogoCell';
import { useGetCafes, useDeleteCafe } from '../../hooks/useCafes';

export default function CafesPage() {
  const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const { data: cafes = [], isLoading, isError, error } = useGetCafes(appliedFilter);
  const { mutate: deleteCafe, isPending: isDeleting } = useDeleteCafe();

  const handleSearch = useCallback(() => {
    setAppliedFilter(locationFilter.trim());
  }, [locationFilter]);

  const handleClearFilter = useCallback(() => {
    setLocationFilter('');
    setAppliedFilter('');
  }, []);

  const handleDelete = useCallback(
    (cafe) => {
      Modal.confirm({
        title: 'Delete Café',
        content: (
          <span>
            Are you sure you want to delete <strong>{cafe.name}</strong>? This will also delete all
            employees assigned to this café.
          </span>
        ),
        okText: 'Delete',
        okButtonProps: { danger: true, loading: isDeleting },
        cancelText: 'Cancel',
        onOk: () =>
          deleteCafe(cafe.id, {
            onSuccess: () => message.success(`"${cafe.name}" deleted successfully`),
            onError: (err) => message.error(err.message),
          }),
      });
    },
    [deleteCafe, isDeleting],
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Logo',
        field: 'logo',
        width: 80,
        sortable: false,
        filter: false,
        cellRenderer: CafeLogoCell,
        cellStyle: { display: 'flex', alignItems: 'center' },
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
        minWidth: 140,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Description',
        field: 'description',
        flex: 2,
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Employees',
        field: 'employees',
        width: 120,
        sortable: true,
        cellRenderer: ({ value, data }) => (
          <button
            className="employee-count-link"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            onClick={() => navigate(`/employees?cafe=${encodeURIComponent(data.name)}`)}
          >
            {value}
          </button>
        ),
      },
      {
        headerName: 'Location',
        field: 'location',
        flex: 1,
        minWidth: 120,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        width: 160,
        cellRenderer: ({ data }) => (
          <Space size="small">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              className="action-btn"
              onClick={() => navigate(`/cafes/edit/${data.id}`)}
            >
              Edit
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="action-btn"
              onClick={() => handleDelete(data)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [navigate, handleDelete],
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Cafés"
        buttonLabel="Add New Café"
        onButtonClick={() => navigate('/cafes/new')}
      />

      {/* Location Filter */}
      <div className="flex gap-2 mb-5">
        <Input
          placeholder="Filter by location..."
          prefix={<SearchOutlined style={{ color: '#c8a97e' }} />}
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          onPressEnter={handleSearch}
          style={{ maxWidth: 320 }}
          allowClear
          onClear={handleClearFilter}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
        {appliedFilter && (
          <Button onClick={handleClearFilter}>Clear</Button>
        )}
        {appliedFilter && (
          <span className="cafe-badge self-center">
            Showing: {appliedFilter}
          </span>
        )}
      </div>

      {isError && (
        <Alert type="error" message={error.message} className="mb-4" showIcon />
      )}

      <div
        className="ag-theme-alpine"
        style={{ height: 520, width: '100%' }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <AgGridReact
            rowData={cafes}
            columnDefs={columnDefs}
            pagination
            paginationPageSize={10}
            rowHeight={60}
            suppressCellFocus
            animateRows
          />
        )}
      </div>
    </div>
  );
}
