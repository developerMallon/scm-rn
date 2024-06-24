import React, { useState, ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type ExpandableViewProps = {
  title: string;
  children: ReactNode;
};

const ExpandableView: React.FC<ExpandableViewProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(()=>{
    setExpanded(false)
  },[])
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <AntDesign name={expanded ? 'arrowup' : 'arrowdown'} size={20} color="#1bb6c8" />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden', // Para garantir que o conteúdo expandido não ultrapasse o contêiner
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#1bb6c8',
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 16,
    backgroundColor: '#fff',
  },

});

export default ExpandableView;
