import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { checkImageURL } from '../../../../utils/index.js';
import styles from './nearbyjobcard.style';
import { icons } from '../../../../constants'

const NearbyJobCard = ({ audio, handleNavigate,number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const playStoredSound = async (recordURI) => {
    console.log('Playing stored sound');
    setIsPlaying(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordURI }, { shouldPlay: true });
      setSound(newSound);
    } catch (err) {
      console.error('Failed to play stored sound', err);
    }
    setIsPlaying(false);
  };

  const stopPlayingSound = async () => {
    setIsPlaying(false);
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const renderMediaButton = () => {
    if (isPlaying) {
      return (
        <TouchableOpacity style={styles.mediaButton} onPress={stopPlayingSound}>
          <Text style={styles.mediaButtonText}>Stop</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <React.Fragment>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => playStoredSound(audio)}
          >
            <Text style={styles.mediaButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => console.log('Additional button clicked')}
          >
            <Text style={styles.mediaButtonText}>Additional Button</Text>
          </TouchableOpacity>
        </React.Fragment>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleNavigate()}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: checkImageURL(audio.employer_logo)
              ? audio.employer_logo
              : 'https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg',
          }}
          resizeMode="contain"
          style={styles.logImage}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {`Record Number ${number+1}`}
        </Text>
        <Text style={styles.jobType}>{audio.job_employment_type}</Text>
        
      {audio && renderMediaButton()}
      {isPlaying && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

    </TouchableOpacity>
  );
};

export default NearbyJobCard;
