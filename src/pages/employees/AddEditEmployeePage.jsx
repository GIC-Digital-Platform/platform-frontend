import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, message, Spin, Alert, Radio, Select } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import AppTextInput from '../../components/common/AppTextInput';
import { useCreateEmployee, useUpdateEmployee } from '../../hooks/useEmployees';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { getEmployees } from '../../api/employeeApi';
import { getCafes } from '../../api/cafeApi';

export default function AddEditEmployeePage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState(null);

  const { allowNavigation } = useUnsavedChanges(isDirty);

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();
  const isSaving = isCreating || isUpdating;

  // Load cafes for the dropdown
  const { data: cafes = [] } = useQuery({
    queryKey: ['cafes-dropdown'],
    queryFn: () => getCafes(),
  });

  // Load existing employee when editing
  const { data: employeeData, isLoading: isLoadingEmployee, isError } = useQuery({
    queryKey: ['employee-edit', id],
    queryFn: () => getEmployees(),
    enabled: isEditing,
    select: (employees) => employees.find((e) => e.id === id),
  });

  useEffect(() => {
    if (isEditing && employeeData) {
      const matchedCafe = cafes.find((c) => c.name === employeeData.cafe);
      form.setFieldsValue({
        name: employeeData.name,
        email_address: employeeData.email_address,
        phone_number: employeeData.phone_number,
        gender: employeeData.gender,
        cafe_id: matchedCafe?.id || null,
      });
      setSelectedCafeId(matchedCafe?.id || null);
      setIsDirty(false);
    }
  }, [employeeData, cafes, form, isEditing]);

  const handleValuesChange = (changed) => {
    setIsDirty(true);
    if ('cafe_id' in changed) {
      setSelectedCafeId(changed.cafe_id || null);
      if (!changed.cafe_id) {
        form.setFieldValue('start_date', undefined);
      }
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      email_address: values.email_address,
      phone_number: values.phone_number,
      gender: values.gender,
      cafe_id: values.cafe_id || null,
      start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null,
    };

    if (isEditing) {
      updateEmployee(
        { id, ...payload },
        {
          onSuccess: () => {
            message.success('Employee updated successfully');
            allowNavigation();
            setIsDirty(false);
            navigate('/employees');
          },
          onError: (err) => message.error(err.message),
        },
      );
    } else {
      createEmployee(payload, {
        onSuccess: () => {
          message.success('Employee created successfully');
          allowNavigation();
          setIsDirty(false);
          navigate('/employees');
        },
        onError: (err) => message.error(err.message),
      });
    }
  };

  if (isEditing && isLoadingEmployee) {
    return (
      <div className="page-container flex justify-center items-center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isEditing && isError) {
    return (
      <div className="page-container">
        <Alert type="error" message="Failed to load employee data" showIcon />
      </div>
    );
  }

  const cafeOptions = cafes.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="page-container">
      <div className="form-page-header">
        <h1 className="page-title">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h1>
      </div>

      <Card className="form-card" style={{ borderColor: '#e8d5be' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          autoComplete="off"
          validateTrigger={['onChange', 'onBlur']}
        >
          <AppTextInput
            name="name"
            label="Full Name"
            placeholder="e.g. Alice Tan"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 6, message: 'Name must be at least 6 characters' },
              { max: 10, message: 'Name must be at most 10 characters' },
            ]}
          />

          <AppTextInput
            name="email_address"
            label="Email Address"
            type="email"
            placeholder="alice@example.com"
            rules={[
              { required: true, message: 'Email address is required' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          />

          <AppTextInput
            name="phone_number"
            label="Phone Number"
            placeholder="e.g. 91234567"
            rules={[
              { required: true, message: 'Phone number is required' },
              {
                pattern: /^[89]\d{7}$/,
                message: 'Phone must start with 8 or 9 and have exactly 8 digits',
              },
            ]}
            maxLength={8}
          />

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Gender is required' }]}
          >
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="cafe_id" label="Assigned Café (optional)">
            <Select
              placeholder="Select a café..."
              options={cafeOptions}
              allowClear
              showSearch
              optionFilterProp="label"
              style={{ maxWidth: 400 }}
            />
          </Form.Item>

          {selectedCafeId && (
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[
                {
                  required: Boolean(selectedCafeId),
                  message: 'Start date is required when assigning a café',
                },
              ]}
            >
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontSize: 14,
                  color: '#1a1008',
                  outline: 'none',
                  width: 200,
                }}
                onChange={(e) => {
                  form.setFieldValue('start_date', e.target.value);
                  setIsDirty(true);
                }}
              />
            </Form.Item>
          )}

          <Form.Item className="mt-6">
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isSaving}
                size="large"
              >
                {isEditing ? 'Save Changes' : 'Create Employee'}
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/employees')}
                disabled={isSaving}
              >
                <ArrowLeftOutlined /> Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
