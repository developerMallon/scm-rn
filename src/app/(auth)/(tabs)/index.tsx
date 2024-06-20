import { StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../../context/ctx";
import { Link, router } from "expo-router";
import { config } from '../../../../config';

export default function Home() {
  // O session vai armazenar as informações do usuário logado
  const { signOut, session } = useSession();
  // Se não houver session vai direcionar para a tela de login
  if (!session) {
    router.replace("/"); // redireciona para a tela de login
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewLogo}>
        <Image source={require('@/assets/images/Mallon - Azul e Preto.png')} style={styles.logo} />
      </View>
      {session && (
        <Text style={styles.messageText}>Olá, {session.first_name}</Text>
      )}
      <Text style={styles.messageText}>Seja bem-vindo(a) ao.</Text>
      <Text style={[styles.messageText, styles.messageApp]}>APP Mallon.</Text>
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
  viewLogo: {
    backgroundColor: "#fafafa",
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20
  },
  logo: {
    height: 65,
    width: 278,
    marginVertical: 30
  },
  messageText: {
    color: '#fafafa',
    fontSize: 28
  },
  messageApp: {
    fontWeight: '800'
  },
});
