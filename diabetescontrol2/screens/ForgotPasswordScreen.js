import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const resetPassword = async () => {
    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];

      const userIndex = parsedUsers.findIndex(u => u.email === email && u.birthdate === birthdate);
      if (userIndex !== -1) {
        parsedUsers.splice(userIndex, 1);
        await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));
        Alert.alert('Usuario eliminado', 'El usuario ha sido eliminado. Por favor, crea un nuevo registro.');
        navigation.navigate('Register');
      } else {
        Alert.alert('Error', 'Usuario no encontrado o la fecha de nacimiento no coincide.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error eliminando el usuario.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Esta funcion elimina la cuenta</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon name="email" />}
      />
      <TextInput
        label="Fecha de Nacimiento (dd/mm/yyyy)"
        value={birthdate}
        onChangeText={setBirthdate}
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon name="calendar" />}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={resetPassword}
      >
        Borrar Usuario
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        Cancelar
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
  },
});

export default ForgotPasswordScreen;
