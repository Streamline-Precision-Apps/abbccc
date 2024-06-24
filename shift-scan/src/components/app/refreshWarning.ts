import { useEffect } from 'react';

/**
 * Custom hook to handle browser refresh events.
 * @param {Function} onBeforeUnload - Custom function to execute before unload.
 */
const useBeforeUnload = (onBeforeUnload: (event: BeforeUnloadEvent) => void) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      if (typeof onBeforeUnload === 'function') {
        onBeforeUnload(event);
      }
      event.returnValue = ''; // For some browsers, this is necessary for the custom message to be displayed.
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onBeforeUnload]);
};

export default useBeforeUnload;