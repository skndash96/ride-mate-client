import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FaXmark } from 'react-icons/fa6';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotifContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: number) => void;
}

const NotifContext = createContext<NotifContextType | undefined>(undefined);

export const useNotifs = () => {
  const context = useContext(NotifContext);

  if (!context) {
    throw new Error('useNotifs must be used within a NotifProvider');
  }
  return context;
};

export const NotifProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
    };
    
    setNotifications((prevNotifs) => [...prevNotifs, newNotification]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prevNotifs) => prevNotifs.filter((notif) => notif.id !== id));
  };

  return (
    <NotifContext.Provider value={{ notifications, addNotification, removeNotification }}>
      <div className='fixed top-0 right-0 m-4'>
        <ul className='z-20 flex flex-col gap-2'>
          {notifications.map((notif) => (
            <li
              className="bg-white rounded-md overflow-hidden shadow-md flex flex-row"
              key={notif.id}
              style={{ color: notif.type }}
            >
              <div className={`self-stretch grid place-items-center ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
                <button onClick={() => removeNotification(notif.id)} className='w-8 grid place-items-center aspect-square text-white'>
                  <FaXmark />
                </button>
              </div>

              <p className='p-2 text-sm'>
                {notif.message}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {children}
    </NotifContext.Provider>
  );
};