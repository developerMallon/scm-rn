import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import * as Sharing from 'expo-sharing';

const FilesPage: React.FC = () => {
  const router = useRouter();
  const { ticket_id, uri, name } = useLocalSearchParams<{ ticket_id: string, uri: string; name: string }>();

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
          <Video
            source={{ uri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
        );
      case 'pdf':
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => Sharing.shareAsync(uri)}
          >
            <Text style={styles.buttonText}>Open PDF</Text>
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
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4
  },
  image: {
    width: '100%',
    height: '100%',
  },
  video: {
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
    bottom: 30,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default FilesPage;
