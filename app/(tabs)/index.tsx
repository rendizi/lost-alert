import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabOneScreen() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Fetch announcements from AsyncStorage
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const storedAnnouncements = await AsyncStorage.getItem('announcements');
        if (storedAnnouncements) {
          setAnnouncements(JSON.parse(storedAnnouncements));
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lost Alerts</Text>
      {announcements.length > 0 ? (
        announcements.map((announcement, index) => (
          <View key={index} style={styles.announcementContainer}>
            <Text style={styles.announcementText}>{announcement.body}</Text>
          </View>
        ))
      ) : (
        <Text>No announcements available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  announcementContainer: {
    backgroundColor: '#f9c2ff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  announcementText: {
    fontSize: 16,
  },
});
