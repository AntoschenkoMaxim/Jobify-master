import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register, Landing, Error, ProtectedRoute } from './pages'
import { AllJobs, AllJobsUser, Profile, SharedLayout, Stats, AddJob, AddCandidate, AddCourse, AllCandidatesUser, AllCourses, AllCoursesUser, AllCandidates } from './pages/dashboard'
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
          <Route index element={<AllJobs />} />
          <Route path='stats' element={<Stats />} />
          <Route path='all-jobs-user' element={<AllJobsUser />} />
          <Route path='all-candidates-user' element={<AllCandidatesUser />} />
          <Route path='all-candidates' element={<AllCandidates />} />
          <Route path='all-courses-user' element={<AllCoursesUser />} />
          <Route path='all-courses' element={<AllCourses />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='add-candidate' element={<AddCandidate />} />
          <Route path='add-course' element={<AddCourse />} />
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
