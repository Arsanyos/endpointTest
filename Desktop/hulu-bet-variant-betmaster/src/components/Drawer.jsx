import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

export default function Drawer({ open, onClose, children, className = '' }) {
  const [isOpen, setOpen] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setOpen(open), 100);
    return clearTimeout();
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [open]);

  // if (!open && !isOpen) return null;

  return (
    <div
      className={classNames(
        `fixed inset-0  z-50 flex w-screen flex-col bg-primary-500  duration-500 ${
          !isOpen ? ' top-full ' : 'top-16'
        }`,
        className
      )}
    >
      <div className="relative flex w-full flex-col overflow-y-auto pb-10 ">
        {children}
      </div>
    </div>
  );
}
