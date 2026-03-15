import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, message, Spin, Alert, Popover, Select, Badge, Divider, Radio } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useGetCafes, useDeleteCafe } from '../../hooks/useCafes';
import { useSingaporePlanningAreas } from '../../hooks/useSingaporePlanningAreas';

function LogoCell({ value }) {
  return (
    <div className="logo-placeholder">
      <img src={value || '/images/defaultLogo.jpg'} alt="logo" />
    </div>
  );
}

function EmployeeCountCell({ value, data, navigate }) {
  return (
    <button
      style={{
        background: '#ffefda',
        border: 'none',
        borderRadius: 20,
        padding: '4px 12px',
        cursor: 'pointer',
        color: '#e8851a',
        fontWeight: 600,
        fontSize: 14,
      }}
      onClick={() => navigate(`/employees?cafe=${encodeURIComponent(data.name)}`)}
    >
      {value} {value < 2 ? 'person' : 'people'}
    </button>
  );
}

const FILTER_MODES = { REGION: 'region', AREA: 'area' };

export default function CafesPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterMode, setFilterMode] = useState(FILTER_MODES.REGION);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const { data: planningAreas = [] } = useSingaporePlanningAreas();

  const regions = useMemo(
    () => [...new Set(planningAreas.map((p) => p.REGION_N).filter(Boolean))].sort(),
    [planningAreas],
  );

  const areasByRegion = useMemo(() => {
    const map = {};
    planningAreas.forEach(({ PLN_AREA_N, REGION_N }) => {
      if (!map[REGION_N]) map[REGION_N] = [];
      map[REGION_N].push(PLN_AREA_N);
    });
    return map;
  }, [planningAreas]);

  const areaOptions = useMemo(() => {
    const source =
      filterMode === FILTER_MODES.AREA && selectedRegion
        ? areasByRegion[selectedRegion] ?? []
        : planningAreas.map((p) => p.PLN_AREA_N);
    return [...new Set(source)].sort().map((a) => ({ value: a, label: toTitleCase(a) }));
  }, [filterMode, selectedRegion, planningAreas, areasByRegion]);

  const activeFilterLabel = selectedRegion || selectedArea;

  // When filtering by region: expand to all planning areas in that region
  const areasForSelectedRegion = useMemo(
    () => (selectedRegion ? areasByRegion[selectedRegion] ?? [] : []),
    [selectedRegion, areasByRegion],
  );

  const { data: cafes = [], isLoading, isError, error } = useGetCafes('');
  const { mutate: deleteCafe, isPending: isDeleting } = useDeleteCafe();

  const filtered = useMemo(() => {
    let result = cafes;

    // Apply region / area filter
    if (selectedRegion) {
      const areas = areasForSelectedRegion.map((a) => a.toUpperCase());
      result = result.filter((c) => areas.includes(c.location?.toUpperCase()));
    } else if (selectedArea) {
      result = result.filter(
        (c) => c.location?.toUpperCase() === selectedArea.toUpperCase(),
      );
    }

    // Apply search text
    if (searchText) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (c) => c.name?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [cafes, selectedRegion, selectedArea, areasForSelectedRegion, searchText]);

  const clearFilter = () => {
    setSelectedRegion(null);
    setSelectedArea(null);
  };

  const handleApplyRegion = (val) => {
    setSelectedRegion(val || null);
    setSelectedArea(null);
    if (val) setFilterOpen(false);
  };

  const handleApplyArea = (val) => {
    setSelectedArea(val || null);
    setSelectedRegion(null);
    if (val) setFilterOpen(false);
  };

  const handleDelete = useCallback(
    (cafe) => {
      Modal.confirm({
        title: `Delete ${cafe.name}?`,
        content: (
          <span>
            All employees under this café will also be deleted. <br />
            Are you sure you want to proceed? <br /><br />
            <span style={{ color: '#e8851a' }}>Note that these data will be permanently deleted!</span>
          </span>
        ),
        okText: 'Delete',
        okButtonProps: { danger: true, loading: isDeleting },
        cancelText: 'Cancel',
        onOk: () =>
          deleteCafe(cafe.id, {
            onSuccess: () => message.success(`"${cafe.name}" deleted`),
            onError: (err) => message.error(err.message),
          }),
      });
    },
    [deleteCafe, isDeleting],
  );

  const columnDefs = useMemo(
    () => [
      { headerName: 'Logo', field: 'logo', minWidth: 100, sortable: false, filter: false, cellRenderer: LogoCell },
      { headerName: 'Name', field: 'name', flex: 1, minWidth: 120 },
      {
        headerName: 'Description',
        field: 'description',
        flex: 2,
        minWidth: 200,
        cellStyle: {
          color: '#6b7280',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        tooltipField: 'description',
      },
      {
        headerName: 'Employees',
        field: 'employees',
        minWidth: 100,
        sortable: true,
        cellRenderer: (params) => <EmployeeCountCell {...params} navigate={navigate} />,
      },
      {
        headerName: 'Location',
        field: 'location',
        flex: 1,
        minWidth: 150,
        cellRenderer: ({ value }) => (
          <span className="cafe-badge">
            <EnvironmentOutlined style={{ color: '#e8851a', marginRight: 6 }} />
            {value}
          </span>
        ),
      },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        width: 100,
        cellRenderer: ({ data }) => (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="action-icon-btn" title="Edit" onClick={() => navigate(`/cafes/edit/${data.id}`)}>
              <EditOutlined style={{ fontSize: 13 }} />
            </button>
            <button className="action-icon-btn danger" title="Delete" onClick={() => handleDelete(data)}>
              <DeleteOutlined style={{ fontSize: 13 }} />
            </button>
          </div>
        ),
      },
    ],
    [navigate, handleDelete],
  );

  const filterContent = (
    <div style={{ width: 260 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        Filter by Location
      </div>

      <Radio.Group
        value={filterMode}
        onChange={(e) => { setFilterMode(e.target.value); setSelectedRegion(null); setSelectedArea(null); }}
        style={{ marginBottom: 12, display: 'flex', gap: 8 }}
      >
        <Radio.Button value={FILTER_MODES.REGION} style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>
          By Region
        </Radio.Button>
        <Radio.Button value={FILTER_MODES.AREA} style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>
          By Area
        </Radio.Button>
      </Radio.Group>

      {filterMode === FILTER_MODES.REGION ? (
        <Select
          placeholder="Select a region..."
          style={{ width: '100%' }}
          value={selectedRegion}
          onChange={handleApplyRegion}
          allowClear
          options={regions.map((r) => ({
            value: r,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{toTitleCase(r)}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{areasByRegion[r]?.length ?? 0} areas</span>
              </div>
            ),
          }))}
        />
      ) : (
        <Select
          placeholder="Select an area..."
          style={{ width: '100%' }}
          value={selectedArea}
          onChange={handleApplyArea}
          allowClear
          showSearch
          optionFilterProp="label"
          options={areaOptions}
        />
      )}

      {activeFilterLabel && (
        <>
          <Divider style={{ margin: '10px 0' }} />
          <button
            style={{ width: '100%', padding: '6px 0', border: '1px solid #e5e7eb', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: 12, color: '#6b7280' }}
            onClick={() => { clearFilter(); setFilterOpen(false); }}
          >
            Clear filter
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-top">
        <h1 className="page-title">Cafes</h1>
        <div className="page-top-right">
          <Input
            className="search-input"
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Search cafes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Popover open={filterOpen} onOpenChange={setFilterOpen} trigger="click" placement="bottomRight" content={filterContent}>
            <Badge dot={Boolean(activeFilterLabel)} color="#e8851a" offset={[-4, 4]}>
              <button
                title="Filter by location"
                style={{
                  width: 40, height: 40, border: '1px solid #e5e7eb', borderRadius: 8,
                  background: activeFilterLabel ? '#fff4e6' : '#fff',
                  color: activeFilterLabel ? '#e8851a' : '#6b7280',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'all 0.15s',
                }}
              >
                <FilterOutlined />
              </button>
            </Badge>
          </Popover>
          <Button className="btn-primary" icon={<PlusOutlined />} onClick={() => navigate('/cafes/new')}>
            Add New Café
          </Button>
        </div>
      </div>

      {activeFilterLabel && (
        <div style={{ marginBottom: 12, fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          <EnvironmentOutlined style={{ color: '#e8851a' }} />
          {selectedRegion
            ? <>Showing cafes in <strong style={{ color: '#e8851a' }}>{toTitleCase(selectedRegion)}</strong> region ({areasForSelectedRegion.length} areas)</>
            : <>Showing cafes in <strong style={{ color: '#e8851a' }}>{toTitleCase(selectedArea)}</strong></>
          }
          <button style={{ color: '#e8851a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 13, padding: 0 }} onClick={clearFilter}>
            Clear
          </button>
        </div>
      )}

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
                suppressCellFocus
                animateRows
                pagination
                paginationPageSize={10}
                suppressPaginationPanel
                onGridReady={(params) => params.api.sizeColumnsToFit()}
              />
            </div>
            <div className="table-footer">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{cafes.length}</strong> cafes</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function toTitleCase(str = '') {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
