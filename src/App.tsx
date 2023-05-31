import './App.css';
import Home from './pages/Home';
import Position from './pages/Position';
import Charts from './pages/Charts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/position' element={<Position />} />
                <Route path='/charts' element={<Charts />} />
            </Routes>
        </Router>
    );
}

export default App;
