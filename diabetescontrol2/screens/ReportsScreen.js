import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { FlatList } from 'react-native';
import { Button, List, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const ReportsScreen = ({ navigation }) => {
  const [glucoseData, setGlucoseData] = useState([]);

  const loadGlucoseData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('glucoseData');
      const glucoseData = storedData ? JSON.parse(storedData) : [];
      setGlucoseData(glucoseData);
    } catch (error) {
      console.error(error);
    }
  };

  const exportToPDF = async () => {
    try {
      const logoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABP0lEQVR42p2TTU/CQBSGv7OBWagwCe5GDu4O3oQbd8jSNv4A2+D8E0YkUykKbjoXcgmXDA3eT89c45cv5RsgPQ1Y9fRGbG3BRI3ftbOmfoUMelUU0O8NFAJHBXspsFuzU0gd+SVAHJ1XllKp1OHLMsM/nLZHDHOX8MbzHZh5FeIh98tq3v8n19hlAD7u++FyKQFM1giUSiQazMB3U7f9HfTtHFqhpQ07yMkiSCPeSLojsFQuhIpVPJNJLJpP5HkUQ6J79H7XUqTGC/3uGxEuvChWiSfbWh4FJnpG4KY0TqA44bBl1k+uHZHHJMRJFmJpHQP7TSLDfQ+MXY+dleK4lo2+YvlODxT0fAPyeAAAAAElFTkSuQmCC'; // 

      let htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Informes de Glucosa - Diabetes Control</title>
            <style>
              @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; }
              img { display: block; margin: 0 auto; width: 100px; height: auto; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .icon { width: 16px; height: 16px; vertical-align: middle; margin-right: 5px; }
            </style>
          </head>
          <body>
            <img src="${logoUrl}" alt="Diabetes Control Logo" />
            <h1>Informes de Glucosa - Diabetes Control</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nivel</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
      `;
      
      glucoseData.forEach(record => {
        htmlContent += `
          <tr>
            <td>${record.id}</td>
            <td><i class="fas fa-tint icon"></i>${record.level}</td>
            <td>${record.date}</td>
            <td>${record.time}</td>
          </tr>
        `;
      });

      htmlContent += `
              </tbody>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      Alert.alert('PDF Creado', 'El archivo PDF ha sido creado exitosamente.');

      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un error al crear el archivo PDF.');
    }
  };

  useEffect(() => {
    loadGlucoseData();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Informes</Title>
      <FlatList
        data={glucoseData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={`Nivel: ${item.level}`}
            description={`${item.date} ${item.time}`}
            left={props => <List.Icon {...props} icon="water-outline" />}
            style={styles.item}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={exportToPDF}
      >
        Exportar a PDF
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        Volver
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  item: {
    width: '100%',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  button: {
    width: '100%',
    marginVertical: 10,
    elevation: 2,
  },
});

export default ReportsScreen;
