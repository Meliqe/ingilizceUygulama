import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
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
import { openDatabase, initializeDatabase } from './database/database';
import { SQLiteProvider } from 'expo-sqlite';
import LoadingScreen from './screens/LoadingScreen';

const Stack = createStackNavigator();

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

  useEffect(() => {
    const onInit = async () => {
      try {
        await fetchFonts();
        setFontsLoaded(true);
        const db = await openDatabase();
        await checkTablesExist(db);
        await checkOnboarding();
      } catch (error) {
        console.error('OnInit sırasında bir hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    onInit();
  }, []);

  const checkTablesExist = async (db) => {
    try {
      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync(`
          SELECT name FROM sqlite_master WHERE type='table';
        `);

        if (result && result.length > 0) {
          const tableNames = result.map(row => row.name);
          if (!tableNames.includes('words') || !tableNames.includes('idioms')) {
            await initializeDatabase(db);
          }
        } else {
          await initializeDatabase(db);
        }
      });
    } catch (error) {
      console.error('Tablo kontrolü sırasında bir hata oluştu:', error);
    }
  };

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

  if (isLoading || !fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SQLiteProvider databaseName="englishDB.db">
      <UpdateProvider>
        <NavigationContainer>
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
        </NavigationContainer>
      </UpdateProvider>
    </SQLiteProvider>
  );
}
