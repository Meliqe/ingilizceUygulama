import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import OnboardingScreen from './screens/OnboardingScreen';
import Anasayfa from './screens/Anasayfa';
import Liste from './screens/Liste';
import KelimeEkle from './screens/KelimeEkle';
import Quiz from './screens/Quiz';
import DeyimEkle from './screens/DeyimEkle';
import KelimeDetay from './screens/KelimeDetay';
import DeyimDetay from './screens/DeyimDetay';
import DeyimListe from './screens/DeyimListe';
import QuizDeyim from './screens/QuizDeyim';
import { UpdateProvider } from './context/UpdateContext';
import { getItem, setItem } from './utils/asyncStorage';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { openDatabase, initializeDatabase } from './database/database';
import LoadingScreen from './screens/LoadingScreen';
import { SQLiteProvider } from 'expo-sqlite';

const Stack = createStackNavigator();

const loadDatabase = async () => {
  const dbName = "englishDB.db";
  const dbAsset = require("./assets/englishDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins-regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'poppins-lightitalic': require('./assets/fonts/Poppins-LightItalic.ttf'),
    'poppins-thinitalic': require('./assets/fonts/Poppins-ThinItalic.ttf'),
  });
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchFonts();
        setFontsLoaded(true);
        await loadDatabase();

        // Veritabanı bağlantısını al
        const db = await openDatabase(); // openDatabase() fonksiyonunu çağırarak db'yi al
        await initializeDatabase(db); // Veritabanını başlat

        setDbLoaded(true);
        await checkOnboarding();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const checkOnboarding = async () => {
    try {
      const onboarded = await getItem('onboarded');
      setIsOnboarding(onboarded !== '1');
    } catch (error) {
      console.error('Onboarding kontrolü sırasında bir hata oluştu:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await setItem('onboarded', '1');
      setIsOnboarding(false);
    } catch (error) {
      console.error('Onboarding tamamlanırken bir hata oluştu:', error);
    }
  };

  if (isLoading || !fontsLoaded || !dbLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SQLiteProvider databaseName="englishDB.db" >
      <NavigationContainer>
        <UpdateProvider>
          <Stack.Navigator initialRouteName={isOnboarding ? 'OnboardingScreen' : 'Anasayfa'}>
            <Stack.Screen
              name='Anasayfa'
              component={Anasayfa}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='OnboardingScreen'
              options={{ headerShown: false }}
            >
              {props => <OnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
            </Stack.Screen>
            <Stack.Screen name='DeyimEkle' component={DeyimEkle} options={{ headerShown: false }} />
            <Stack.Screen name='KelimeEkle' component={KelimeEkle} options={{ headerShown: false }} />
            <Stack.Screen name='Quiz' component={Quiz} options={{ headerShown: false }} />
            <Stack.Screen name='Liste' component={Liste} options={{ headerShown: false }} />
            <Stack.Screen name='KelimeDetay' component={KelimeDetay} options={{ headerShown: false }} />
            <Stack.Screen name='DeyimDetay' component={DeyimDetay} options={{ headerShown: false }} />
            <Stack.Screen name='DeyimListe' component={DeyimListe} options={{ headerShown: false }} />
            <Stack.Screen name='QuizDeyim' component={QuizDeyim} options={{ headerShown: false }} />
          </Stack.Navigator>
        </UpdateProvider>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

