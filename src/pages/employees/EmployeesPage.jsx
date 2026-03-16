import React, { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Modal, message, Spin, Alert, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useGetEmployees, useDeleteEmployee } from '../../hooks/useEmployees';

/* ── Avatar cell ── */
const AVATAR_COLORS = ['#e8851a', '#6366f1', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#f59e0b'];

function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function NameCell({ value }) {
  return (
    <div className="cell-avatar">
      <div className="avatar-circle" style={{ background: getAvatarColor(value) }}>
        {getInitials(value)}
      </div>
      <span className="cell-name">{value}</span>
    </div>
  );
}

function EmployeeIdCell({ value }) {
  return <span className="cell-employee-id">{value}</span>;
}

function CafeBadgeCell({ value }) {
  if (!value) return <span style={{ color: '#d1d5db', fontSize: 12 }}>—</span>;
  return <span className="cafe-badge">{value}</span>;
}

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cafeFilter = searchParams.get('cafe') || '';
  const [searchText, setSearchText] = React.useState('');

  const { data: employees = [], isLoading, isError, error } = useGetEmployees(cafeFilter);
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const filtered = useMemo(() => {
    if (!searchText) return employees;
    const q = searchText.toLowerCase();
    return employees.filter(
      (e) =>
        e.name?.toLowerCase().includes(q) ||
        e.id?.toLowerCase().includes(q) ||
        e.cafe?.toLowerCase().includes(q),
    );
  }, [employees, searchText]);

  const handleDelete = useCallback(
    (emp) => {
      Modal.confirm({
        title: `Delete ${emp.name}?`,
        content: (
          <span>
            Are you sure you want to proceed? <br /><br />
            <span style={{ color: '#e8851a' }}>Note that this data will be permanently deleted!</span>
          </span>
        ),
        okText: 'Delete',
        okButtonProps: { danger: true, loading: isDeleting },
        cancelText: 'Cancel',
        onOk: () =>
          deleteEmployee(emp.id, {
            onSuccess: () => message.success(`"${emp.name}" deleted`),
            onError: (err) => message.error(err.message),
          }),
      });
    },
    [deleteEmployee, isDeleting],
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Employee ID',
        field: 'id',
        width: 140,
        cellRenderer: EmployeeIdCell,
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
        minWidth: 160,
        cellRenderer: NameCell,
      },
      {
        headerName: 'Email Address',
        field: 'email_address',
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: 'Days Worked',
        field: 'days_worked',
        width: 150,
        sortable: true,
      },
      {
        headerName: 'Café Name',
        field: 'cafe',
        flex: 1,
        width: 200,
        cellRenderer: CafeBadgeCell,
      },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        width: 100,
        cellRenderer: ({ data }) => (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className="action-icon-btn"
              title="Edit"
              onClick={() => navigate(`/employees/edit/${data.id}`)}
            >
              <EditOutlined style={{ fontSize: 13 }} />
            </button>
            <button
              className="action-icon-btn danger"
              title="Delete"
              onClick={() => handleDelete(data)}
            >
              <DeleteOutlined style={{ fontSize: 13 }} />
            </button>
          </div>
        ),
      },
    ],
    [navigate, handleDelete],
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-top">
        <h1 className="page-title">Employees</h1>
        <div className="page-top-right">
          {cafeFilter && (
            <button
              style={{ fontSize: 13, color: '#e8851a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setSearchParams({})}
            >
              Clear café filter: {cafeFilter}
            </button>
          )}
          <Input
            className="search-input"
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Search employees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/new')}
          >
            Add New Employee
          </Button>
        </div>
      </div>

      {isError && <Alert type="error" message={error.message} showIcon style={{ marginBottom: 16 }} />}

      <div className="table-card">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="ag-theme-alpine" style={{ height: 500 }}>
              <AgGridReact
                rowData={filtered}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: false }}
                suppressCellFocus
                animateRows
                pagination
                paginationPageSize={10}
                suppressPaginationPanel
                onGridReady={(params) => params.api.sizeColumnsToFit()}
                onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
              />
            </div>
            <div className="table-footer">
              <span>
                Showing <strong>{filtered.length}</strong> of <strong>{employees.length}</strong> employees
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
