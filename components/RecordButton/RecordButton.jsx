import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, Alert } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './RecordButtons.style';
import axios from 'axios';
const ShortcutButton = ({ title, onPress }) => (
  <View style={styles.container}>
    <Button title={title} onPress={onPress} color="#007AFF" />
  </View>
);

const RecordButton = ({onSavedRecord}) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [latestRecordURI, setLatestRecordURI] = useState(null);
  const [recordURI, setRecordURI] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('recordURI').then(uri => setRecordURI(uri));
  }, [recordURI]);

  const startRecording = async () => {
    try {
      console.log('Starting recording..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    //Alert.alert('Recording stopped', `Recording stored at ${uri}`);

    setLatestRecordURI(uri);

    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
  };

  const playSound = async () => {
    console.log('Playing sound');
    setIsPlaying(true);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      sound.setOnPlaybackStatusUpdate(async playbackStatus => {
        if (playbackStatus.didJustFinish) {
          await sound.setPositionAsync(0); // Rewind the sound to the start
        }
      });
      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play sound', err);
    }
    setIsPlaying(false);
  };



  const saveRecord = async () => {
    try {
      const storedRecordsJson = await AsyncStorage.getItem('storedRecords');
      const storedRecords = storedRecordsJson ? JSON.parse(storedRecordsJson) : [];
      const updatedRecords = [...storedRecords, latestRecordURI];
      const updatedRecordsJson = JSON.stringify(updatedRecords);
      await AsyncStorage.setItem('storedRecords', updatedRecordsJson);
  
      // Construct the data object to be sent in the request body
      const data = {
        "audio": latestRecordURI,
        "transcription": "",
        "summary": ""
    }
  
      // Make a POST request to the specified URL
      const response = await fetch('http://127.0.0.1:8000/transcriptions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Check the response status and show an alert
      if (response.ok) {
        setRecordURI(latestRecordURI);
        onSavedRecord(true);
        Alert.alert('Record Saved', 'Your record has been saved and can be played back later.');
      } else {
        throw new Error('Failed to save record');
      }
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ShortcutButton
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      {sound && (
        <ShortcutButton
          title={isPlaying ? 'Playing...' : 'Play Sound'}
          onPress={playSound}
        />
      )}
      {latestRecordURI && (
        <ShortcutButton
          title="Save Record"
          onPress={saveRecord}
        />
      )}
    </View>
  );
};



export default RecordButton;
