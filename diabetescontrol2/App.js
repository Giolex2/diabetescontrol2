import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReminderScreen from './screens/ReminderScreen';
import GlucoseScreen from './screens/GlucoseScreen';
import ReportsScreen from './screens/ReportsScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar Usuario' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Contraseña' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Diabetes Control' }} />
            <Stack.Screen name="Reminder" component={ReminderScreen} options={{ title: 'Crear Recordatorio' }} />
            <Stack.Screen name="Glucose" component={GlucoseScreen} options={{ title: 'Registrar Niveles de Glucosa' }} />
            <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Informes' }} />
          </Stack.Navigator>
        </NavigationContainer>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Giobanny Garces 2024 - NRC: 45-55296, Computación Móvil</Text>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});

export default App;
