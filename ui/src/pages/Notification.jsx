import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      const data = await res.json();
      const sortedNotifications = (data.notifications || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);

      sortedNotifications
        .filter(n => !n.read)
        .forEach(n => toast.info(n.message, { autoClose: 5000 }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        credentials: "include"
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchNotifications();
    markAllRead();
  }, []);

  const handleDeleteNotification = async (id) => {
  try {
    const res = await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (res.ok) {
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to delete notification");
    }
  } catch (error) {
    console.log("Error deleting notification:", error);
    toast.error("Error deleting notification");
  }
};

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center flex-grow space-y-6 px-4">
        <div className="w-full max-w-3xl bg-yellow-50 shadow-lg rounded-lg p-4 my-4 flex justify-between">
          <p className="italic text-lg text-gray-500 ml-6">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center flex-grow space-y-6 px-4">
          <p className="italic text-lg text-gray-500 ml-6">No notifications at the moment</p>
        
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center flex-grow space-y-6 px-4">
      {notifications.map((notification, index) => (
        <div key={index} className="w-full max-w-3xl bg-yellow-50 shadow-lg rounded-lg p-4 my-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="italic text-lg text-gray-800 ml-6">{notification.message}</p>
              {notification.createdAt && (
                <p className="text-xs text-gray-500 ml-6 mt-2">
                  {formatDateTime(notification.createdAt)}
                </p>
              )}
            </div>
            <button 
              onClick={() => handleDeleteNotification(notification._id)}
              className="text-gray-500 hover:text-red-600 transition-colors ml-4"
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notification;