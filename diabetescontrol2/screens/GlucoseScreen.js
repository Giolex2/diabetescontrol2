import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlucoseScreen = ({ navigation }) => {
  const [glucoseLevel, setGlucoseLevel] = useState('');

  const saveGlucoseLevel = async () => {
    try {
      const id = new Date().toISOString(); 
      const newRecord = {
        id,
        level: glucoseLevel,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      // Obtener registros existentes
      const storedData = await AsyncStorage.getItem('glucoseData');
      const glucoseData = storedData ? JSON.parse(storedData) : [];

      // Agregar el nuevo registro
      glucoseData.push(newRecord);

      // Guardar los datos actualizados en AsyncStorage
      await AsyncStorage.setItem('glucoseData', JSON.stringify(glucoseData));

      Alert.alert("Guardado exitoso", "El nivel de glucosa ha sido guardado exitosamente.");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Error", "Hubo un error guardando el nivel de glucosa.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Registrar Niveles de Glucosa</Title>
      <TextInput
        label="Nivel de Glucosa"
        value={glucoseLevel}
        onChangeText={setGlucoseLevel}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        left={<TextInput.Icon name="thermometer" />}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={saveGlucoseLevel}
      >
        Guardar
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
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

export default GlucoseScreen;