import React, { useState } from "react";
import { StyleSheet, Button, TextInput, View, Text, Pressable, Image, Alert } from "react-native";
import { useSession } from "./ctx";
import { router } from "expo-router";

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace("/");
    } catch (error) {
      console.error("Falha no login: ", error);
      Alert.alert("Falha no login", "Verifique seu email ou senha");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerLogin}>
        <Image source={require('@/assets/images/Mallon - Azul e Preto.png')} style={styles.logo} />
        <TextInput autoCapitalize="none" placeholder="Email" style={styles.input} onChangeText={setEmail} />
        <TextInput autoCapitalize="none" placeholder="Senha" secureTextEntry style={styles.input} onChangeText={setPassword} />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1bb6c8',
  },
  containerLogin: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
    paddingVertical: 40,
    borderRadius: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1bb6c8',
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '95%',
    borderRadius: 5
  },
  button: {
    marginTop: 20,
    paddingVertical: 16,
    width: '95%',
    borderRadius: 5,
    backgroundColor: '#1bb6c8',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: 'bold'
  },
  logo: {
    height: 65,
    width: 278,
    marginVertical: 30
  }
})


