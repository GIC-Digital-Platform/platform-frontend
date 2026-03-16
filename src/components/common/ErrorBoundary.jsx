import React from 'react';
import { Button, Result } from 'antd';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function RouterErrorFallback() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Result
        status={is404 ? '404' : '500'}
        title={is404 ? 'Page Not Found' : 'Something went wrong'}
        subTitle={is404 ? 'The page you are looking for does not exist.' : 'An unexpected error occurred. Please refresh the page.'}
        extra={
          <Button type="primary" onClick={() => window.location.replace('/')}>
            Reload
          </Button>
        }
      />
    </div>
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.props.forRouter) return <RouterErrorFallback />;

    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Result
            status="500"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please refresh the page."
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
