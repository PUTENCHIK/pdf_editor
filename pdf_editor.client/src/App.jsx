import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RootPage from './pages/RootPage/RootPage';
import EditorPage from './pages/EditorPage/EditorPage';
import ConvertPage from './pages/ConvertPage/ConvertPage';
import DeletePagePage from './pages/DeletePagePage/DeletePagePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootPage/>}></Route>
                <Route path="/editor" element={<EditorPage/>}/>
                <Route path="/convert" element={<ConvertPage/>}/>
                <Route path='/delete_page' element={<DeletePagePage/>}/>

                {/* <Switch>
                    <Route path='/delete_page/:tool' element={<h2>tool</h2>}/>
                </Switch> */}

                <Route path='*' element={<h2>Ресурс не найден</h2>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
