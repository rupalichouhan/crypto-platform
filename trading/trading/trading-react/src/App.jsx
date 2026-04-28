import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layout components
import Navbar from './page/Navbar/Navbar';

// Pages
import Home from './page/Home/Home';
import Activity from './page/Activity/Activity';
import Portfolio from './page/Portfolio/Portfolio';
import Wallet from './page/Wallet/Wallet';
import Withdrawal from './page/Withdrawal/Withdrawal';
import PaymentDetails from './page/PaymentDetails/PaymentDetails';
import StockDetails from './page/StockDetails/StockDetails';
import Watchlist from './page/Watchlist/Watchlist';
import Profile from './page/Profile/Profile';
import SearchCoin from './page/Search/SearchCoin';
import Notfound from './page/Notfound/Notfound';
import Auth from './page/Auth/Auth';
import { getUser } from './State/Auth/Action';

function App() {
const auth = useSelector((store) => store.auth);
const dispatch = useDispatch();

console.log("auth", auth);
const isAuthenticated = auth.jwt || localStorage.getItem("jwt");

useEffect(() => {
  const jwt = auth.jwt || localStorage.getItem("jwt");
  if (jwt) {
    dispatch(getUser(jwt));
  }
}, [auth.jwt, dispatch]);

  return (
    <>
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/payment-details" element={<PaymentDetails />} />
            <Route path="/market/:id" element={<StockDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchCoin />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
