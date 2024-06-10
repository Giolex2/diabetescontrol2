import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Provider, Title } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js'; 

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [diabetesType, setDiabetesType] = useState('');
  const [weight, setWeight] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(false);
    setBirthdate(currentDate);
  };

  const registerUser = async () => {
    try {
      const users = await AsyncStorage.getItem('users');
      console.log('Retrieved users:', users);
      const parsedUsers = users ? JSON.parse(users) : [];
      console.log('Parsed users:', parsedUsers);

      if (parsedUsers.length >= 10) {
        Alert.alert('Límite alcanzado', 'Solo puedes registrar un máximo de 10 usuarios.');
        return;
      }

      const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret_key').toString();
      const newUser = {
        email,
        password: encryptedPassword,
        name,
        birthdate: birthdate.toISOString(),
        diabetesType,
        weight,
      };

      parsedUsers.push(newUser);
      console.log('Updated users:', parsedUsers);
      await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));
      console.log('Users saved to AsyncStorage');

      Alert.alert('Registro exitoso', 'Usuario registrado exitosamente.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', `Hubo un error registrando el usuario: ${error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Registrar Usuario</Title>
        <TextInput
          label="Nombres y Apellidos"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon name="account" />}
        />
        <TextInput
          label="Peso en KG"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Icon name="weight" />}
        />
        <TextInput
          label="Fecha de Nacimiento"
          value={birthdate.toLocaleDateString()}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon name="calendar" />}
          onFocus={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker value={birthdate} mode="date" display="default" onChange={onChangeDate} />
        )}
        <View style={styles.radioGroup}>
          <Title style={styles.subtitle}>Tipo de Diabetes</Title>
          <RadioButton.Group onValueChange={newValue => setDiabetesType(newValue)} value={diabetesType}>
            <RadioButton.Item label="Tipo 1" value="tipo1" />
            <RadioButton.Item label="Tipo 2" value="tipo2" />
          </RadioButton.Group>
        </View>
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
          onPress={registerUser}
        >
          Guardar
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          Cancelar
        </Button>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  radioGroup: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
});

export default RegisterScreen;
