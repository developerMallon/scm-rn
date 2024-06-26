import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons/';
// import Pdf from 'react-native-pdf'

const { width, height } = Dimensions.get('window');

// const PdfResource = { uri: 'https://www.mallon.com.br/mms/api/public/storage/uploads/1713558538_3341.pdf', cache: true }

const FilesPage: React.FC = () => {
  const router = useRouter();
  const { ticket_id, uri, name } = useLocalSearchParams<{ ticket_id: string; uri: string; name: string }>();

  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoUri, setVideoUri] = useState<string | undefined>(uri);

  const player = useVideoPlayer(videoUri || '', player => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    setVideoUri(uri); // Atualiza o videoUri quando uri muda
  }, [uri]);

  useEffect(() => {
    const subscription = player.addListener('playingChange', isPlaying => {
      setIsPlaying(isPlaying);
    });
    return () => {
      subscription.remove();
    };
  }, [player]);

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text>No file to display</Text>
      </View>
    );
  }

  const renderFile = () => {
    const fileExtension = name?.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image source={{ uri }} style={styles.image} />;
      case 'mp4':
      case 'mov':
        return (
          <View style={styles.contentContainer}>
            <VideoView
              ref={ref}
              style={styles.video}
              player={player}
              contentFit='contain'
              allowsFullscreen
              allowsPictureInPicture
            />
            <View style={styles.controlsContainer}>
              <Pressable onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
                setIsPlaying(!isPlaying);
              }}>
                <Text style={styles.controlsContainerText}>{isPlaying ? 'Pause' : 'Play'}</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'pdf':
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => Sharing.shareAsync(uri)}
          >
            <Text style={styles.buttonText}>Abrir PDF</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => Sharing.shareAsync(uri)}
          >
            <Text style={styles.buttonText}>Open {name}</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderFile()}
      <Pressable style={styles.backButton} onPress={() => router.replace(`/scm/${ticket_id}`)}>
        <AntDesign name='closecircleo' size={26} style={styles.closeButton} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    color: '#1bb6c8',
  },
  contentContainer: {
    // backgroundColor: '#999',
    // flex: 1,
    // marginBottom: 20,
    // width: width,
    // height: height,
    // flex: 1,
    // paddingTop: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingHorizontal: 50,
  },
  video: {
    width: width * 0.95,
    height: '100%',
  },
  controlsContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    position: 'absolute',
    borderRadius: 5,
    alignContent: 'center',
    bottom: 0,
    right: 0,
    margin: 10,
    padding: 10,

  },
  controlsContainerText: {
    color: '#1bb6c8',
    fontSize: 24,
    fontWeight: 'bold'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
});

export default FilesPage;
