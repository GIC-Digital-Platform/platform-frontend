import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Upload, Card, message, Spin, Alert } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

import AppTextInput from '../../components/common/AppTextInput';
import { useCreateCafe, useUpdateCafe } from '../../hooks/useCafes';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { getCafes } from '../../api/cafeApi';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function AddEditCafePage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [fileList, setFileList] = useState([]);

  const { allowNavigation } = useUnsavedChanges(isDirty);

  const { mutate: createCafe, isPending: isCreating } = useCreateCafe();
  const { mutate: updateCafe, isPending: isUpdating } = useUpdateCafe();
  const isSaving = isCreating || isUpdating;

  const { data: cafeData, isLoading: isLoadingCafe, isError } = useQuery({
    queryKey: ['cafe-edit', id],
    queryFn: () => getCafes(),
    enabled: isEditing,
    select: (cafes) => cafes.find((c) => c.id === id),
  });

  useEffect(() => {
    if (isEditing && cafeData) {
      form.setFieldsValue({
        name: cafeData.name,
        description: cafeData.description,
        location: cafeData.location,
      });
      setIsDirty(false);
    }
  }, [cafeData, form, isEditing]);

  const handleValuesChange = () => setIsDirty(true);

  const handleUploadChange = ({ fileList: newList }) => {
    setFileList(newList);
    setIsDirty(true);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Only image files are allowed');
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      message.error(`Logo must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto-upload; we handle it on submit
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('location', values.location);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('logo', fileList[0].originFileObj);
    }

    if (isEditing) {
      updateCafe(
        { id, formData },
        {
          onSuccess: () => {
            message.success('Café updated successfully');
            allowNavigation();
            setIsDirty(false);
            navigate('/cafes');
          },
          onError: (err) => message.error(err.message),
        },
      );
    } else {
      createCafe(formData, {
        onSuccess: () => {
          message.success('Café created successfully');
          allowNavigation();
          setIsDirty(false);
          navigate('/cafes');
        },
        onError: (err) => message.error(err.message),
      });
    }
  };

  if (isEditing && isLoadingCafe) {
    return (
      <div className="page-container flex justify-center items-center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isEditing && isError) {
    return (
      <div className="page-container">
        <Alert type="error" message="Failed to load café data" showIcon />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-page-header">
        <h1 className="page-title">{isEditing ? 'Edit Café' : 'Add New Café'}</h1>
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
            label="Café Name"
            placeholder="e.g. The Daily Grind"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 6, message: 'Name must be at least 6 characters' },
              { max: 10, message: 'Name must be at most 10 characters' },
            ]}
          />

          <AppTextInput
            name="description"
            label="Description"
            type="textarea"
            placeholder="A short description of the café..."
            rows={3}
            rules={[
              { required: true, message: 'Description is required' },
              { max: 256, message: 'Description must be at most 256 characters' },
            ]}
          />

          <AppTextInput
            name="location"
            label="Location"
            placeholder="e.g. Orchard, Marina Bay"
            rules={[{ required: true, message: 'Location is required' }]}
          />

          <Form.Item label="Logo" name="logo">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Logo (max 2MB)</Button>
            </Upload>
            {isEditing && cafeData?.logo && fileList.length === 0 && (
              <div className="mt-2">
                <img src={cafeData.logo} alt="current logo" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </div>
            )}
          </Form.Item>

          <Form.Item className="mt-6">
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isSaving}
                size="large"
              >
                {isEditing ? 'Save Changes' : 'Create Café'}
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/cafes')}
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
