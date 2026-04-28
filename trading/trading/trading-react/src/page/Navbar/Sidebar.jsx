import React from 'react';
import {
  ActivityLogIcon,
  DashboardIcon,
  ExitIcon,
  HomeIcon,
  PersonIcon
} from '@radix-ui/react-icons';
import {
  BookmarkIcon,
  CreditCardIcon,
  LandmarkIcon,
  WalletIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../State/Auth/Action';

const menuItems = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-6 w-6" /> },
  { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className="h-6 w-6" /> },
  { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="h-6 w-6" /> },
  { name: "Activity", path: "/activity", icon: <ActivityLogIcon className="h-6 w-6" /> },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-6 w-6" /> },
  { name: "Payment Details", path: "/payment-details", icon: <LandmarkIcon className="h-6 w-6" /> },
  { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className="h-6 w-6" /> },
  { name: "Profile", path: "/profile", icon: <PersonIcon className="h-6 w-6" /> },
  { name: "Logout", path: "/", icon: <ExitIcon className="h-6 w-6" />, logout: true }
];

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (item) => {
    if (item.logout) {
      dispatch(logout());
      navigate('/');
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-auto pr-1 mt-6 space-y-3">
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          className="flex items-center gap-5 py-4 w-full justify-start"
          onClick={() => handleNavigation(item)}
        >
          <span className="w-8">{item.icon}</span>
          <p className="text-base">{item.name}</p>
        </Button>
      ))}
    </div>
  );
}

export default Sidebar;
