import React, { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Modal, message, Spin, Alert, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import PageHeader from '../../components/common/PageHeader';
import DaysWorkedCell from '../../components/employees/DaysWorkedCell';
import { useGetEmployees, useDeleteEmployee } from '../../hooks/useEmployees';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeFilter = searchParams.get('cafe') || '';

  const { data: employees = [], isLoading, isError, error } = useGetEmployees(cafeFilter);
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const handleDelete = useCallback(
    (employee) => {
      Modal.confirm({
        title: 'Delete Employee',
        content: (
          <span>
            Are you sure you want to delete <strong>{employee.name}</strong>?
          </span>
        ),
        okText: 'Delete',
        okButtonProps: { danger: true, loading: isDeleting },
        cancelText: 'Cancel',
        onOk: () =>
          deleteEmployee(employee.id, {
            onSuccess: () => message.success(`"${employee.name}" deleted successfully`),
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
        width: 130,
        filter: 'agTextColumnFilter',
        cellStyle: { fontFamily: 'monospace', fontSize: 12 },
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
        minWidth: 130,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Email',
        field: 'email_address',
        flex: 1.5,
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Phone',
        field: 'phone_number',
        width: 120,
        filter: false,
      },
      {
        headerName: 'Days Worked',
        field: 'days_worked',
        width: 150,
        sortable: true,
        filter: false,
        cellRenderer: DaysWorkedCell,
      },
      {
        headerName: 'Café',
        field: 'cafe',
        flex: 1,
        minWidth: 130,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }) =>
          value ? (
            <span className="cafe-badge">{value}</span>
          ) : (
            <Tag color="default" style={{ fontSize: 11 }}>Unassigned</Tag>
          ),
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
              onClick={() => navigate(`/employees/edit/${data.id}`)}
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
        title={cafeFilter ? `Employees — ${cafeFilter}` : 'Employees'}
        buttonLabel="Add New Employee"
        onButtonClick={() => navigate('/employees/new')}
      />

      {cafeFilter && (
        <div className="mb-4 flex gap-2 items-center">
          <span className="text-coffee-DEFAULT font-medium">Filtered by café:</span>
          <span className="cafe-badge">{cafeFilter}</span>
          <Button size="small" onClick={() => navigate('/employees')}>
            Clear Filter
          </Button>
        </div>
      )}

      {isError && (
        <Alert type="error" message={error.message} className="mb-4" showIcon />
      )}

      <div className="ag-theme-alpine" style={{ height: 520, width: '100%' }}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <AgGridReact
            rowData={employees}
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
