import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import RootPage from './pages/RootPage/RootPage';
import EditorPage from './pages/EditorPage/EditorPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootPage/>}></Route>

                <Route path="/editor" element={<EditorPage/>}/>

                <Route path='*' element={<h2>Ресурс не найден</h2>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
