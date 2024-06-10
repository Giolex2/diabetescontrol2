import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];

      const user = parsedUsers.find(u => u.email === email);
      if (user) {
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret_key').toString(CryptoJS.enc.Utf8);
        if (decryptedPassword === password) {
          await AsyncStorage.setItem('currentUser', email);
          await AsyncStorage.setItem('currentPassword', password);
          Alert.alert('Inicio de sesión exitoso', 'Has iniciado sesión exitosamente.');
          navigation.navigate('Home');
          return;
        }
      }

      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error iniciando sesión.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Iniciar Sesión</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon name="email" />}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon name="lock" />}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={loginUser}
      >
        Iniciar Sesión
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        Crear Usuario
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        Olvidé mi Contraseña
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    marginVertical: 10,
    elevation: 2,
  },
});

export default LoginScreen;
