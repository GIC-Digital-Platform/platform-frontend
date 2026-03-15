import { useEffect, useCallback, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { Modal } from 'antd';

/**
 * Warns the user when navigating away with unsaved changes.
 * Returns `allowNavigation` — call it synchronously before navigate()
 * on a successful save to skip the blocker.
 *
 * @param {boolean} isDirty - Whether the form has unsaved changes
 */
export function useUnsavedChanges(isDirty) {
  const bypassRef = useRef(false);

  const allowNavigation = useCallback(() => {
    bypassRef.current = true;
  }, []);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !bypassRef.current && currentLocation.pathname !== nextLocation.pathname,
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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && !bypassRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return { allowNavigation };
}
