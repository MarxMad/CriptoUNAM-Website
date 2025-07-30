import { useWallet } from '../context/WalletContext';
import { isAdminWallet, ADMIN_PERMISSIONS, type AdminPermission } from '../constants/admin';

export const useAdmin = () => {
  const { walletAddress, isConnected } = useWallet();
  
  const isAdmin = isConnected && walletAddress ? isAdminWallet(walletAddress) : false;
  
  const hasPermission = (permission: AdminPermission): boolean => {
    if (!isAdmin) return false;
    return ADMIN_PERMISSIONS[permission] || false;
  };
  
  const canCreateCourse = hasPermission('CREATE_COURSE');
  const canEditCourse = hasPermission('EDIT_COURSE');
  const canDeleteCourse = hasPermission('DELETE_COURSE');
  
  const canCreateNewsletter = hasPermission('CREATE_NEWSLETTER');
  const canEditNewsletter = hasPermission('EDIT_NEWSLETTER');
  const canDeleteNewsletter = hasPermission('DELETE_NEWSLETTER');
  
  const canCreateEvent = hasPermission('CREATE_EVENT');
  const canEditEvent = hasPermission('EDIT_EVENT');
  const canDeleteEvent = hasPermission('DELETE_EVENT');
  
  const canCreateNotification = hasPermission('CREATE_NOTIFICATION');
  const canEditNotification = hasPermission('EDIT_NOTIFICATION');
  const canDeleteNotification = hasPermission('DELETE_NOTIFICATION');
  
  return {
    isAdmin,
    walletAddress,
    isConnected,
    hasPermission,
    // Permisos específicos
    canCreateCourse,
    canEditCourse,
    canDeleteCourse,
    canCreateNewsletter,
    canEditNewsletter,
    canDeleteNewsletter,
    canCreateEvent,
    canEditEvent,
    canDeleteEvent,
    canCreateNotification,
    canEditNotification,
    canDeleteNotification,
  };
}; 