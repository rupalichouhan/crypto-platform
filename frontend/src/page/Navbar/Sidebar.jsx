import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Star,
  Activity,
  Wallet,
  Landmark,
  CreditCard,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../State/Auth/Action';

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Portfolio", path: "/portfolio", icon: <PieChart className="h-5 w-5" /> },
  { name: "Watchlist", path: "/watchlist", icon: <Star className="h-5 w-5" /> },
  { name: "Activity", path: "/activity", icon: <Activity className="h-5 w-5" /> },
  { name: "Wallet", path: "/wallet", icon: <Wallet className="h-5 w-5" /> },
  { name: "Payment Details", path: "/payment-details", icon: <Landmark className="h-5 w-5" /> },
  { name: "Withdrawal", path: "/withdrawal", icon: <CreditCard className="h-5 w-5" /> },
  { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
  { name: "Logout", path: "/", icon: <LogOut className="h-5 w-5 text-rose-400" />, logout: true }
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="h-[calc(100vh-140px)] overflow-y-auto pr-1 space-y-1.5 py-2">
      {menuItems.map((item, index) => {
        const isActive = !item.logout && location.pathname === item.path;

        return (
          <Button
            key={index}
            variant="ghost"
            className={`flex items-center gap-4 py-3 px-4 w-full justify-start rounded-xl text-sm transition-all duration-150 ${
              isActive
                ? "bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/30 shadow-sm"
                : item.logout
                ? "text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 mt-6"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-900"
            }`}
            onClick={() => handleNavigation(item)}
          >
            <span className={isActive ? "text-orange-400" : "text-slate-400"}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </Button>
        );
      })}
    </div>
  );
}

export default Sidebar;
