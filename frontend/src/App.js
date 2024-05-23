
import './App.css';
import UserForm from './components/UserForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/UserList';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/userList" element={<UserList />} />
      <Route path="/editUser/:id" element={<UserForm />} />

    </Routes>
  </Router>
  );
}

export default App;
