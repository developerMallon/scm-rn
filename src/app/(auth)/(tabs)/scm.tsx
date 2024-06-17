import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import { router } from "expo-router";
import axios from "axios";

type Ticket = {
  id: number;
  title: string;
  // Adicione outras propriedades relevantes do ticket aqui
};

export default function Scm() {
  const { signOut, session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    // Verifica se a sessão é válida. Caso contrário força a rota de login
    if (!session) {
      router.replace("/");
      return;
    }

    const getTickets = async () => {
      try {
        const response = await axios.get("https://scm-api.mallon.click/complaint", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
        });

        console.error("response.data: ", response.data);
        setTickets(response.data);

      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    getTickets();
  }, [session]);
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1bb6c8" />
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      {session && (
        <Text style={styles.messageText}>Olá, {session.first_name}</Text>
      )}
      <Text style={styles.messageText}>Seja bem-vindo(a).</Text>
      <Text style={styles.messageText}>SCM Mallon</Text>

      {loading ? (
        <Text style={styles.messageText}>Loading...</Text>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.ticketContainer}>
              <Text style={styles.ticketTitle}>{item.title}</Text>
              {/* Renderize outras propriedades do ticket aqui */}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => { router.replace('/'); }}>
        <Text style={styles.buttonText}>Voltar</Text>
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
    marginVertical: 30,
  },
  messageText: {
    color: '#fafafa',
    fontSize: 28,
  },
  button: {
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#fafafa',
  },
  ticketContainer: {
    backgroundColor: '#fafafa',
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1bb6c8',
  },
});
