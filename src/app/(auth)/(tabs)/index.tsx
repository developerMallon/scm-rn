// Tab ONE
import { Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
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
      <Image source={require('@/assets/images/Trucks.png')} style={styles.logo} />
      {session && (
        <Text style={styles.messageText}>Olá, {session.first_name}</Text>
      )}
      <Text style={styles.messageText}>Seja bem-vindo(a).</Text>
      {/* <Text style={styles.messageText}>SCM Mallon</Text> */}
      <Text style={styles.choiceText}>Escolha o sistema desejado:</Text>

      <TouchableOpacity style={styles.systemContainer} onPress={()=>{router.replace('/scm')}} >
        <Text style={styles.systemText}>SCM Mallon</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.systemContainer} onPress={()=>{router.replace('/indicadores')}} >
        <Text style={styles.systemText}>Indicadores Mallon</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.systemContainer} onPress={()=>{router.replace('/novos')}} >
        <Text style={styles.systemText}>Veículos Novos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.systemContainer} onPress={()=>{router.replace('/usados')}} >
        <Text style={styles.systemText}>Veículos Usados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>{ signOut(); }}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
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
  choiceText: {
    marginTop: 20,
    marginBottom: 10,
    color: '#fafafa',
    fontSize: 18
  },
  systemText: {
    color: '#1bb6c8',
    fontSize: 18,
    fontWeight: 'bold'
  },
  systemContainer: {
    width: '90%',
    backgroundColor: '#fafafa',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10
  },
  button: {
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#fafafa'
  }
});
