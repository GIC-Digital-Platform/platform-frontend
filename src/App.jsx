import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import CafesPage from './pages/cafes/CafesPage';
import AddEditCafePage from './pages/cafes/AddEditCafePage';
import EmployeesPage from './pages/employees/EmployeesPage';
import AddEditEmployeePage from './pages/employees/AddEditEmployeePage';

const { Sider, Content, Header } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const selectedKey = location.pathname.startsWith('/employees') ? 'employees' : 'cafes';

  const menuItems = [
    {
      key: 'cafes',
      icon: <span style={{ fontSize: 16 }}>☕</span>,
      label: <NavLink to="/cafes">Cafés</NavLink>,
    },
    {
      key: 'employees',
      icon: <span style={{ fontSize: 16 }}>👥</span>,
      label: <NavLink to="/employees">Employees</NavLink>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#3d2b1f' }}
        width={220}
      >
        <div className="sidebar-logo">
          <span>☕</span>
          {!collapsed && <span>Café Manager</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ background: 'transparent', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#ffffff',
            padding: '0 24px',
            borderBottom: '1px solid #e8d5be',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#6f4e37', fontWeight: 600, fontSize: '1rem' }}>
            {selectedKey === 'cafes' ? '☕ Café Management' : '👥 Employee Management'}
          </span>
        </Header>
        <Content style={{ background: '#fdf8f0' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/cafes" replace />} />
            <Route path="/cafes" element={<CafesPage />} />
            <Route path="/cafes/new" element={<AddEditCafePage />} />
            <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<AddEditEmployeePage />} />
            <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
            <Route path="*" element={<Navigate to="/cafes" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
