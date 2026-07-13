import React, {useEffect, useState} from 'react';
import { JourneyRoot } from './src/passages/JourneyRoot';
//
import { LogLevel, OneSignal } from 'react-native-onesignal';


export default function App() {
  const [initialUrl, setInitialUrl] = useState('https://sharp-wave-tech.top/');
  const [initialId, setInitialId] = useState('dNvB8GIh');
  const [oneSignKkkk, setOneSignKkkk] = useState('c22aa336-f204-4e34-b118-d56052e0aef3');

  useEffect(() => {

    const initOnsignall = async () => {
      try {
        // Verbose-логи лишаємо тільки в дебазі
        if (__DEV__) {
          OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        }

        // OneSignal ініціалізація
        if (oneSignKkkk) {
          OneSignal.initialize(oneSignKkkk);
        }
      } catch (e) {
        console.log('OneSignal init error:', e);
      }
    };
    
    initOnsignall();
    
  }, []);

  return <JourneyRoot
    initialUrl={initialUrl}
    initialId={initialId}
    oneSignKkkk={oneSignKkkk}
  />;
};
