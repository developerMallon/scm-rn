import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type TruncatedTextProps = {
  title: string;
  text: string;
};

const TruncatedText: React.FC<TruncatedTextProps> = ({ title, text }) => {
  const [showFullText, setShowFullText] = useState(false);

  useEffect(()=>{
    setShowFullText(false)
  },[])

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const maxChars = 90; // Número máximo de caracteres a serem exibidos inicialmente

  const shouldShowReadMore = text.length > maxChars;
  const displayedText = showFullText ? text : text.slice(0, maxChars) + (shouldShowReadMore ? '...' : '');


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text} numberOfLines={showFullText ? undefined : 2}>
        {displayedText}
      </Text>
      {shouldShowReadMore && (
        <TouchableOpacity style={styles.truncatedContainer} onPress={toggleShowFullText}>
          <Text style={styles.readMore}>
          <FontAwesome5 name={showFullText ? 'chevron-up' : 'chevron-down'} size={20} color="#1bb6c8" />
            {/* {showFullText ? 'Mostrar menos' : 'Mostrar mais'} */}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000'
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  readMore: {
    color: '#1bb6c8',
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  truncatedContainer: {
    justifyContent: 'space-between'
  }
});

export default TruncatedText;
