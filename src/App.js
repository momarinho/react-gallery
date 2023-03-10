import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoGallery from './components/PhotoGallery';
import DetailScreen from './components/DetailScreen';

import './index.css';

function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/" element={<PhotoGallery />} />
          <Route path="/detail/:id" element={<DetailScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
