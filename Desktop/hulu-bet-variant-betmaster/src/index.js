import React, { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './styles/global.css';
import './styles/styles.css';
import './i18n';
import HomeLoader from '@components/LoaderPages/HomeLoader';
const queryClient = new QueryClient();
const App = React.lazy(() => import('./App'));
const AppWrapper = React.lazy(() => import('./AppWrapper'));

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
// const HomeLoader = () => {
//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-primary-700">
//       <img src={logo} className="h-28 md:h-48" />
//     </div>
//   );
// };
root.render(
  <StrictMode>
    <Router>
      {/* <LanguageContextProvider> */}
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Suspense fallback={<HomeLoader />}>
            <AppWrapper />
          </Suspense>
        </Provider>
      </QueryClientProvider>
      {/* </LanguageContextProvider> */}
    </Router>
  </StrictMode>
);
