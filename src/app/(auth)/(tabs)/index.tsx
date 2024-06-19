import { StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../../context/ctx";
import { router } from "expo-router";
import { config } from '../../../../config';

export default function Home() {
  // O session vai armazenar as informações do usuário logado
  const { signOut, session } = useSession();
  // Se não houver session vai direcionar para a tela de login
  if (!session) {
    router.replace("/"); // redireciona para a tela de login
  }

  const showEnv = () => {

      const { PUBLIC_STATUS, API_URL_SCM_PRODUCTION, API_URL_SCM_DEVELOPMENT } = config;

      console.log("PUBLIC_STATUS: ", PUBLIC_STATUS)
      console.log("API_URL_SCM_PRODUCTION: ", API_URL_SCM_PRODUCTION)
      console.log("API_URL_SCM_DEVELOPMENT: ", API_URL_SCM_DEVELOPMENT)
  }

    return (
      <View style={styles.container}>
        <Image source={require('@/assets/images/Mallon - Preto.png')} style={styles.logo} />
        {/* <Image source={require('@/assets/images/Trucks.png')} style={styles.trucks} /> */}
        {session && (
          <Text style={styles.messageText}>Olá, {session.first_name}</Text>
        )}
        <Text style={styles.messageText}>Seja bem-vindo(a).</Text>
        {/* <Text style={styles.messageText}>SCM Mallon</Text> */}
        <Text style={styles.choiceText}>Escolha o sistema desejado:</Text>

        <TouchableOpacity style={styles.systemContainer} onPress={() => { router.replace('/scm') }} >
          <Text style={styles.systemText}>SCM Mallon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.systemContainer} onPress={() => { router.replace('/indicadores') }} >
          <Text style={styles.systemText}>Indicadores Mallon</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.systemContainer} onPress={()=>{router.replace('/novos')}} >
        <Text style={styles.systemText}>Veículos Novos</Text>
      </TouchableOpacity> */}
        <TouchableOpacity style={styles.systemContainer} onPress={() => { router.replace('/usados') }} >
          <Text style={styles.systemText}>Veículos Usados</Text>
        </TouchableOpacity>

        <Pressable style={styles.button} onPress={() => { signOut(); }}>
          <Text style={styles.buttonText}>Sair</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => { router.replace('/teste') }}>
          <Text style={styles.buttonText}>Teste</Text>
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
      height: 65,
      width: 278,
      marginVertical: 30
    },
    trucks: {
      height: 100,
      width: 278,
      marginBottom: 30
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
