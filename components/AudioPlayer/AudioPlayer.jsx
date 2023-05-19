import React, { useState, useEffect } from 'react';
import { View, Text, Slider , TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { Audio } from 'expo-av';
import styles from './AudioPlayer.style'
const AudioPlayer = ({ audioUrl }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    loadAudio();
    return unloadAudio;
  }, []);

  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const unloadAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
      }
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <View>
      <View>
        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={handleSeek}
        />
      </View>
      <View style={styles.container} >
      <TouchableOpacity style={styles.mediaButton} onPress={handlePlayPause}>
        <Image
          source={isPlaying ? require('./pause-icon.png') : require('./play-icon.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
      <Text>{formatTime(position)}/{formatTime(duration)}</Text>
      </View>
      

      </View>
      <View>

      {isPlaying && <ActivityIndicator />}
    </View>
    </View>
  );
};

export default AudioPlayer;
