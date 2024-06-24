// InputModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface InputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (input: string) => void;
  title: string;
  placeholder: string;
}

const InputModal: React.FC<InputModalProps> = ({ isVisible, onClose, onSave, title, placeholder }) => {
  const [input, setInput] = useState('');

  const handleSave = () => {
    onSave(input);
    setInput('');
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={input}
          onChangeText={setInput}
        />
        <Button title="Salvar" onPress={handleSave} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default InputModal;
