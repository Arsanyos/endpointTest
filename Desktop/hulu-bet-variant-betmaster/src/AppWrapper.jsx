import React, { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import Login from '@pages/Login';
import CreateAccount from '@pages/CreateAccount';
import HomeLoader from '@components/LoaderPages/HomeLoader';
import ErrorBoundary from '@components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { useUser } from '@hooks/useUser';
import { useDispatch, useSelector } from 'react-redux';
import { updateTelegramData } from '@ReduxStore/userSlice';
import ClientSession from '@services/client-session';
import UserService from '@services/users.service';

import API from '@services/API';
import CommonLayout from '@components/CommonLayout';
import Games from '@pages/Games';
import PageLoader from '@components/LoaderPages/PageLoader';
import GameView from '@pages/GameView';
import Virtual from '@pages/Virtual';
import { PrivateRoute } from './App';
import PrivateLayout from '@components/PrivateLayout';
import Signin from '@pages/Signin';
import RightBar from '@components/RightBar';
import {
  updateConfigurations,
  updateConfigurationsSportType,
  updateUIMode,
} from '@ReduxStore/configurationSlice';
import { useCoreData } from '@hooks/useCoreData';

const App = React.lazy(() => import('./App'));
const Wallet = React.lazy(() => import('@pages/Wallet'));
const BetForMeWallet = React.lazy(() => import('@pages/BetForMeWallet'));
const Profile = React.lazy(() => import('@pages/Profile'));
const ReferInfo = React.lazy(() => import('@pages/ReferInfo'));
const PageNotAuth = React.lazy(() => import('@pages/PageNotAuth'));
// const PrivateLayout = React.lazy(() => import('@components/PrivateLayout'));
const BetHistory = React.lazy(() => import('@pages/BetHistory'));
const BetHistoryDetail = React.lazy(() => import('@pages/BetHistoryDetail'));
const JackpotBetHistory = React.lazy(() => import('@pages/JackpotBetHistory'));
const Jackpot = React.lazy(() => import('@pages/JackpotDetail'));
const JackpotBetHistoryDetail = React.lazy(() =>
  import('@pages/JackpotBetHistoryDetail')
);
const Transaction = React.lazy(() => import('@pages/Transaction'));
const Balance = React.lazy(() => import('@pages/Balance'));
const JackpotArchiveDetail = React.lazy(() =>
  import('@pages/JackpotArchiveDetail')
);

export default function AppWrapper() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const userDetail = useSelector((state) => state.user.userDetail);
  const UIMode = useSelector((state) => state.configuration.UIMode);
  const { ready, expand } = window.Telegram.WebApp;
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { logOut } = useUser();
  const { getConfiguration } = useCoreData();

  const dispatch = useDispatch();
  const MEDIA_SIZE_SM = 768;

  let [searchParams, setSearchParams] = useSearchParams();
  const cid = searchParams?.get('cid');
  const mid = searchParams?.get('mid');
  const lang = searchParams?.get('lang');
  const logged_in = searchParams.get('logged_in');
  const mode = searchParams.get('mode');

  useEffect(() => {
    getConfiguration();
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    if (mode) {
      dispatch(updateUIMode({ UIMode: mode }));
    }
    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  useEffect(() => {
    if (window?.Telegram?.WebApp?.initDataUnsafe?.user) {
      ready();
      expand();
    }
    if (i18n.resolvedLanguage != lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  useEffect(() => {
    if (location.pathname == '/logout') {
      logOut(cid, mid);
    }
  }, []);

  useEffect(() => {
    if (!window?.Telegram?.WebApp?.initDataUnsafe?.user) return;
    const tgParams = {};
    for (let entry of searchParams.entries()) {
      tgParams[entry[0]] = entry[1];
    }
    if (tgParams) {
      dispatch(updateTelegramData({ telegramData: tgParams }));
    }

    if (!logged_in && ClientSession.isAuth()) {
      UserService.logout();
    } else if (logged_in && !ClientSession.isAuth()) {
      API.createBot('/logout', {
        chat_id: Number(tgParams.cid),
        message_id: Number(tgParams.mid),
      });
    }
  }, [logged_in]);

  return (
    <div className=" flex min-h-screen bg-body-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        {windowWidth <= MEDIA_SIZE_SM && (
          <Route path="/check-coupon" element={<RightBar />} />
        )}

        {UIMode !== 'cashier' && (
          <Route
            element={
              <CommonLayout
                loginVisible={loginVisible}
                setLoginVisible={setLoginVisible}
              />
            }
          >
            <Route path="/virtual" element={<Virtual />} />
            <Route path="/sign" element={<Signin />} />
            <Route
              path="/games-virtual/games/:gameID/detail"
              element={
                // <VirtualLayout>
                <GameView
                  loginVisible={loginVisible}
                  setLoginVisible={setLoginVisible}
                />
                // </VirtualLayout>
              }
            />
            <Route
              path="/mobile-lite/games/:mobileLiteID/detail"
              element={
                // <VirtualLayout>
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <GameView
                      loginVisible={loginVisible}
                      setLoginVisible={setLoginVisible}
                    />
                  </ErrorBoundary>
                </Suspense>
                // </VirtualLayout>
              }
            />
            <Route
              path="/games"
              element={
                // <VirtualLayout>
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Games />
                  </ErrorBoundary>
                </Suspense>
                // </VirtualLayout>
              }
            />
            <Route
              // path="/auth"
              element={
                <PrivateRoute>
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <PrivateLayout />
                    </ErrorBoundary>
                  </Suspense>
                </PrivateRoute>
              }
            >
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <Profile />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/refer"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <ReferInfo />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/wallet"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <Wallet />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/betforme"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      {userDetail?.member?.member_type == 2 ? (
                        <BetForMeWallet />
                      ) : (
                        <PageNotAuth />
                      )}
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/balance"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <Balance />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/transaction"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <Transaction />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/history"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <BetHistory />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/history/detail/:id"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <BetHistoryDetail />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/history/jackpot"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <JackpotBetHistory />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="/history/jackpotDetail/:id"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <JackpotBetHistoryDetail />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="*"
              element={
                <Suspense fallback={<HomeLoader />}>
                  <App />
                </Suspense>
              }
            />
          </Route>
        )}
        {UIMode === 'cashier' && (
          <Route
            path="*"
            element={
              <Suspense fallback={<HomeLoader />}>
                <App />
              </Suspense>
            }
          />
        )}
      </Routes>
    </div>
  );
}
