import { createPortal } from 'react-dom';

/**
 * Portal utility to correctly expose createPortal from react-dom
 * This helps fix issues with importing from react-dom
 */
export const Portal = {
  createPortal,
};

export default Portal;