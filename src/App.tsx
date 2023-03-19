import React, {
  createContext,
  memo,
  Suspense,
  useEffect,
  useState,
  lazy
} from 'react';
import { Route, Routes, Navigate, useParams, Outlet } from 'react-router-dom';

import styles from './index.module.scss';
import { Empty } from 'antd';
import { getRootPermission } from './service/globalApi';
import { getUserInfo } from './service/user';
import { getTodoNotion } from './service/todo';
import useStore from './store';
import userStore from './store/UserStore';
import TArticle from './pages/ProjectEdit/TArticle';

const NavBar = lazy(() => import('./components/NavBar'));
const Todo = lazy(() => import('./pages/Todo'));
const Project = lazy(() => import('./pages/Project'));
const Loading = lazy(() => import('./components/Loading/Loading'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Login/Register'));
const Notion = lazy(() => import('./pages/Todo/Notion'));
const Task = lazy(() => import('./pages/Todo/Task'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Class = lazy(() => import('./pages/Class'));
const Section = lazy(() => import('./pages/Section'));
const Cycle = lazy(() => import('./pages/Cycle'));
const ProjectEdit = lazy(() => import('./pages/ProjectEdit'));
const Edit = lazy(() => import('./pages/Section/Edit'));
const TestEdit = lazy(() => import('./pages/TestEdit'));
const SectionVideo = lazy(() => import('./pages/SectionVideo'));
const TestDo = lazy(() => import('./pages/TestDo'));
const TestResult = lazy(() => import('./pages/TestResult'));
const CycleAll = lazy(() => import('./pages/CycleAll'));
const Live = lazy(() => import('./pages/Live'));
const CodeRun = lazy(() => import('./pages/CodeRun'));



const Test1 = lazy(() => import('./test'));

const Permission = createContext([]);

function App() {
  // const number = useAppSelector(state => state.counter.number)
  const [rootPermission, setRootPermission] = useState([]);
  const { UserStore } = useStore();
  useEffect(() => {
    UserStore.setUserInfo();
  });

  return (
    <Permission.Provider value={rootPermission}>
      <Routes>
        <Route path="/" element={<Content />}>
          <Route path="" element={<Navigate to="/todo" />} />
          <Route path="/todo" element={<Todo />}>
            <Route path="" element={<Navigate to="/todo/notion" />} />
            <Route path="notion" element={<Notion />} />
            <Route path="task" element={<Task />} />
          </Route>
          <Route path="/project">
            <Route index element={<Project />} />
            <Route path="edit/:id" element={<ProjectEdit />} />
            <Route path=":id">
              <Route index element={<Class />} />
              <Route path="section/:sectionId" element={<Section />} />
            </Route>
          </Route>
          <Route path="/section/:sectionId">
            <Route index element={<Section />} />
            <Route path="edit" element={<Edit />} />
          </Route>
          <Route path="/section/new" element={<Edit />} />
          <Route path="/video/:id" element={<SectionVideo />} />
          <Route path="/test">
            <Route path=":id" element={<TestDo />} />
            <Route path="new" element={<TestEdit />} />
            <Route path=":id/edit" element={<TestEdit />} />
            <Route path=":id/result" element={<TestResult />} />
          </Route>

          <Route path="/calendar" element={<Calendar />} />
          <Route path="/cycle">
            <Route index element={<Cycle />} />
            <Route path="all" element={<CycleAll />} />
          </Route>
          <Route
            path="/live/:id"
            element={<Live isPublicer={false} userStore={userStore} />}
          />
          <Route
            path="/t/live"
            element={<Live isPublicer={true} userStore={userStore} />}
          />
          <Route path="/article" element={<TArticle />} />
          <Route path="/code" element={<CodeRun />} />



          <Route path="/test1" element={<Test1 userStore={userStore} />} />

          <Route path="*" element={<Empty description={false} />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Permission.Provider>
  );
}

function content() {
  return (
    <>
      <NavBar />
      <div className={styles['web-content']}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
const Content = memo(content);

export default memo(App);
