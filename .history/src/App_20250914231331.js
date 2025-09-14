import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Weather from "./Weather";
import Crypto from "./Crypto";
import Quotes from "./Quotes";
import Tasks from "./Tasks"; // ✅ NEW CRUD page
import AdminUsers from "./AdminUsers";
import AdminAddUser from "./AdminAddUser";
import Payment from "./Payment";
import PaymentHistory from "./PaymentHistory";
import Trivia from "./Trivia";
import TikTokDownloader from "./TikTokDownloader";
import Covid from "./Covid"; // New feature placeholder
import WhatsappChecker from "./WhatsappChecker";
import TwitterPage from "./TwitterPage"; // New Twitter page
import UserTweetsCheck from "./UserTweetsCheck"; // New component to display tweets
import BettingMainPage from "./Betting/BettingMainPage"; // New Betting main page
import PaymentPage from "./Betting/PaymentPage"; // New Payment page
import AccountPage from "./Betting/AccountPage"; // New Account page
import LotteryPage from "./Betting/LotteryPage"; // New Lottery page
import WithdrawPage from "./Betting/WithdrawPage";
import DepositPage from "./Betting/DepositPage";
import Chatbost from "./Chatbot"; // Chatbot component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/trivia" element={<Trivia />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/tasks" element={<Tasks />} /> {/* ✅ NEW route */}
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/add-user" element={<AdminAddUser />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/tiktok-downloader" element={<TikTokDownloader />} />
        <Route path="/covid" element={<Covid />} />
        <Route path="/whatsapp-checker" element={<WhatsappChecker />} />
        <Route path="/twitter" element={<TwitterPage />} /> {/* New Twitter route */}
        <Route path="/tweets-check" element={<UserTweetsCheck />} /> {/* New route for tweets */} 
        <Route path="/betting" element={<BettingMainPage />} /> {/* New Betting route */}
        <Route path="/betting/payment" element={<PaymentPage />} /> {/* New Payment route */}
        <Route path="/betting/account" element={<AccountPage />} /> {/* New Account route */}
        <Route path="/betting/lottery" element={<LotteryPage />} /> {/* New Lottery route */} 
        <Route path="/betting/withdraw" element={<WithdrawPage />} />
        <Route path="/betting/deposit" element={<DepositPage />} />
        <Route path="/chatbot" element={<Chatbost />} /> {/* Chatbot route */}
      </Routes> 
    </Router>
  );
}

export default App;
