import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TextProps = {
  title: string;
  text: string;
};

const FieldShowText: React.FC<TextProps> = ({ title, text }) => {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical: 10,
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
  },
});

export default FieldShowText;
