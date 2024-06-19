// Tab ONE
import { StyleSheet, Image, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../../context/ctx";
import { router } from "expo-router";

export default function TabOneScreen() {
  // O session vai armazenar as informações do usuário logado
  const { signOut, session } = useSession();
  // Se não houver session vai direcionar para a tela de login
  if (!session) {
    router.replace("/"); // redireciona para a tela de login
  }

  return (
    <View style={styles.container}>
      {/* <Image source={require('@/assets/images/Trucks.png')} style={styles.logo} /> */}
      {session && (
        <Text style={styles.messageText}>Olá, {session.first_name}</Text>
      )}
      <Text style={styles.messageText}>Seja bem-vindo(a).</Text>
      <Text style={styles.messageText}>Usados Mallon</Text>

      <Pressable style={styles.button} onPress={() => { router.replace('/'); }}>
        <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>
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
  logo: {
    height: 100,
    width: 278,
    marginVertical: 30
  },
  messageText: {
    color: '#fafafa',
    fontSize: 28
  },
  button: {
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#fafafa'
  }
});
