import { useEffect, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';
import { Modal } from 'antd';

/**
 * Warns the user with a confirmation modal when navigating away
 * while there are unsaved form changes.
 *
 * @param {boolean} isDirty - Whether the form has unsaved changes
 */
export function useUnsavedChanges(isDirty) {
  // Block navigation when the form is dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  const confirmNavigation = useCallback(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave this page?',
        okText: 'Leave',
        okButtonProps: { danger: true },
        cancelText: 'Stay',
        onOk: () => blocker.proceed(),
        onCancel: () => blocker.reset(),
      });
    }
  }, [blocker]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      confirmNavigation();
    }
  }, [blocker.state, confirmNavigation]);

  // Also warn on browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}
