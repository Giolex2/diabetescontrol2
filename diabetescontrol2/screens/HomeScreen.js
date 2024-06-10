import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const logout = async () => {
    await AsyncStorage.removeItem('currentUser'); 
    await AsyncStorage.removeItem('currentPassword'); 
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Diabetes Control</Title>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="alarm"
          color="white"
          size={32} 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Reminder')}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Reminder')}
        >
          Crear Recordatorio
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="blood-bag"
          color="white"
          size={32} 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Glucose')}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Glucose')}
        >
          Registrar Niveles de Glucosa
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="file-document"
          color="white"
          size={32} 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Reports')}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Reports')}
        >
          Informes
        </Button>
      </View>
      <View style={styles.logoutContainer}>
        <IconButton
          icon="logout"
          color="white"
          size={32} 
          style={styles.iconButton}
          onPress={logout}
        />
        <Button
          mode="outlined"
          style={styles.logoutButton}
          onPress={logout}
        >
          Cerrar Sesión
        </Button>
      </View>
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
    marginBottom: 40, 
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  button: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#6200ee',
  },
  iconButton: {
    backgroundColor: '#6200ee',
    borderRadius: 50,
    elevation: 2,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50, 
  },
  logoutButton: {
    flex: 1,
    marginLeft: 10,
    borderColor: '#6200ee',
  },
});

export default HomeScreen;
