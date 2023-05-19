import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import  AudioPlayer  from '../../AudioPlayer/AudioPlayer.jsx'
import styles from "./footer.style";
import { icons } from "../../../constants";

const Footer = ({ url }) => {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.likeBtn}>
        <Image
          source={icons.heartOutline}
          resizeMode='contain'
          style={styles.likeBtnImage}
        />
      </TouchableOpacity>*/}
      

      <View
        style={styles.container}
      >
        <AudioPlayer audioUrl={url}/>
      </View>
    </View>
  );
};

export default Footer;