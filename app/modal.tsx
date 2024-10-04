import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Retrieve userData from AsyncStorage and extract phoneNumber
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setPhoneNumber(parsedUserData.phoneNumber || '');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    const newAnnouncement = {
      body: `Объявление: Пропал человек. Имя: ${name}, Ссылка на изображение: ${imageUrl}, Описание: ${description}, Если нашли, звоните по номеру: ${phoneNumber}`,
    };

    try {
      // Retrieve existing announcements from AsyncStorage
      const existingAnnouncements = await AsyncStorage.getItem('announcements');
      const announcementsArray = existingAnnouncements ? JSON.parse(existingAnnouncements) : [];

      // Add new announcement to the array
      announcementsArray.push(newAnnouncement);

      // Save updated array back to AsyncStorage
      await AsyncStorage.setItem('announcements', JSON.stringify(announcementsArray));

      // Notify user and clear form fields
      Alert.alert('Success', 'Announcement saved successfully');
      setName('');
      setImageUrl('');
      setDescription('');
    } catch (error) {
      console.error('Failed to save announcement:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Announcement</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: '80%',
    borderRadius: 5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
