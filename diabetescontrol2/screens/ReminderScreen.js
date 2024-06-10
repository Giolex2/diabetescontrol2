import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Alert } from 'react-native';
import { Button, Title, List, IconButton, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ReminderScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadReminders();
    requestPermissions();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const parsedReminders = storedReminders ? JSON.parse(storedReminders) : [];
      setReminders(parsedReminders);
    } catch (error) {
      console.error(error);
    }
  };

  const requestPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      Alert.alert('Permisos insuficientes', 'Es necesario habilitar los permisos de notificaciones.');
    }
  };

  const scheduleNotification = async (reminder) => {
    const trigger = new Date(reminder.date);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recordatorio",
        body: `Es hora de tu recordatorio programado para ${reminder.time}`,
        sound: true,
      },
      trigger: {
        date: trigger,
      },
    });
  };

  const saveReminder = async () => {
    if (reminders.length >= 2) {
      Alert.alert('Límite alcanzado', 'Solo puedes crear un máximo de dos recordatorios.');
      return;
    }

    try {
      const newReminder = {
        id: new Date().toISOString(),
        time: date.toLocaleTimeString(),
        date: date.toISOString(),
      };

      const updatedReminders = [...reminders, newReminder];
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);

      scheduleNotification(newReminder);

      Alert.alert('Guardado exitoso', 'El recordatorio ha sido guardado exitosamente.');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error guardando el recordatorio.');
      console.error(error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      const updatedReminders = reminders.filter(reminder => reminder.id !== id);
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      Alert.alert('Eliminado', 'El recordatorio ha sido eliminado.');
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Crear Recordatorio</Title>
          <Button icon="clock" mode="contained" onPress={() => setShowDatePicker(true)}>
            Seleccionar Hora
          </Button>
          {showDatePicker && (
            <DateTimePicker value={date} mode="time" display="default" onChange={onChangeDate} />
          )}
          <Text style={styles.selectedTime}>Hora seleccionada: {date.toLocaleTimeString()}</Text>
          <Button
            icon="content-save"
            mode="contained"
            style={styles.button}
            onPress={saveReminder}
          >
            Guardar
          </Button>
          <Button
            icon="cancel"
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            Cancelar
          </Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Recordatorios Guardados</Title>
          <FlatList
            data={reminders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={`Recordatorio`}
                description={`Hora: ${item.time}`}
                left={props => <List.Icon {...props} icon="alarm" />}
                right={props => (
                  <IconButton 
                    {...props} 
                    icon="delete" 
                    onPress={() => deleteReminder(item.id)} 
                  />
                )}
              />
            )}
          />
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        Volver a Home
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedTime: {
    marginVertical: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
  },
});

export default ReminderScreen;
