import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register, Landing, Error, ProtectedRoute } from './pages'
import { AllJobs, Profile, SharedLayout, Stats, AddJob } from './pages/dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* указываем наши пути URL к нашим страницам */}
        {/* Первый путь выступает в роли родительского, от которого идут следующие пути по страницам */}
        <Route path='/'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        {/* Путь к ошибке указывается через звездочку, ошибка выводится в случае ненайденного пути URL */}
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
