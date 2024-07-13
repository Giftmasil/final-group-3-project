import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import Login from './pages/login/Login';
import { AppDispatch, RootState } from './redux/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchUser } from './redux/slices/UserSlice';
import Register from './pages/register/Register';
import EmergencyDetailsPage from './pages/EmergencyDetailsPage/EmergencyDetailsPage';
import Settings from './pages/settings/Settings';
import Alerts from './pages/Alerts/Alerts';
import Records from './pages/Records/Records';
import SearchResults from './pages/SearchResults/SearchResults';
import EmergencyForm from './pages/emergency/EmergencyForm';

function App() {
  const { success } = useSelector((state: RootState) => state.authentication);
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  
  const dispatch: AppDispatch = useDispatch();
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId && success && !userFetched) {
      dispatch(fetchUser({ userId })).then(() => setUserFetched(true));
    }

    if (userId && !loggedInUser && !userFetched) {
      dispatch(fetchUser({ userId })).then(() => setUserFetched(true));
    }
  }, [loggedInUser, dispatch, success, userFetched]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedInUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={loggedInUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={loggedInUser ? <Navigate to="/" /> : <Register />} />
        <Route path="/emergency" element={<EmergencyForm />} />
        <Route path="/emergency/:id" element={<EmergencyDetailsPage />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/alerts' element={<Alerts />} />
        <Route path='/records' element={<Records />} />
        <Route path='/search' element={<SearchResults />}/>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
