import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, View } from "react-native";
import { Text } from "@/components/Themed";
import { useSession } from "../../ctx";
import { router } from "expo-router";
import api from '@/services/api';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

type Ticket = {
  id: number;
  created_at: string;
  client: { first_name: string; last_name: string };
  complaint: string;
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
        const response = await api.get("/complaint/get/?status=1,2,3,4,5", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
        });

        setTickets(response.data);

      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    getTickets();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FAFAFA" />
        <Text style={styles.messageText}>Carregando ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>SCM Mallon</Text>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.ticketContainer}>
            <View style={styles.columnStart}>
              <Text style={styles.ticketId}>{item.id}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.ticketClient}>
                {item.client.first_name} {item.client.last_name}
              </Text>
              <Text style={styles.ticketComplaint}>
                {item.complaint.length > 95 ? `${item.complaint.replace(/\n/g, ' ').slice(0, 95)}...` : item.complaint}
              </Text>
            </View>
            <View style={styles.columnEnd}>
              <TouchableOpacity style={styles.editButton} onPress={() => { /* Função para editar */ }}>
                <FontAwesomeIcon name="edit" size={24} color="#1bb6c8" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
  messageText: {
    color: '#fafafa',
    fontSize: 18,
    marginVertical: 10,
  },
  ticketContainer: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: '98%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnStart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 50,
  },
  centerColumn: {
    flex: 2,
    alignItems: 'flex-start',
    width: '80%',
  },
  columnEnd: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 35,
  },
  ticketId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1bb6c8',
  },
  ticketClient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1bb6c8',
  },
  ticketComplaint: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  button: {
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#fafafa',
  },
  icon: {
    marginLeft: 10,
  },
});
