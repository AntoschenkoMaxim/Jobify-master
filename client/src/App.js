import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard, Register, Landing, Error } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* указываем наши пути URL к нашим страницам */}
        <Route path='/' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        {/* Путь к ошибке указывается через звездочку, ошибка выводится в случае ненайденного пути URL */}
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
