import { useEffect, useState } from 'react';

/**
 * Hook to get the initial data from the Telegram Web Apps API already parsed.
 * @example
 * const { hash } = useTelegramInitData();
 * console.log({ hash });
 */
export default function useTelegramInitData() {
  const [data, setData] = useState({});

  useEffect(() => {
    const firstLayerInitData = Object.fromEntries(
      new URLSearchParams(window.Telegram.WebApp?.initData)
    );

    const initData = {};

    for (const key in firstLayerInitData) {
      try {
        initData[key] = JSON.parse(firstLayerInitData[key]);
      } catch {
        initData[key] = firstLayerInitData[key];
      }
    }

    setData(initData);
  }, []);

  return data;
}
export function useTelegramInitDataParams(initData) {
  const path_params = initData?.start_param?.split('_');
  console.log('array of params', path_params);
  //   return route path with params
  return path_params;
}
export function useIsTelegram() {
  return window?.Telegram?.WebApp?.initData?.user;
}
export function useIsTelegramReady() {
  return window?.Telegram?.WebApp?.ready();
}
export function useTelegram() {
  const sendData = (data) => {
    window.Telegram.WebApp.sendData(data);
  };
  return { sendData };
}
