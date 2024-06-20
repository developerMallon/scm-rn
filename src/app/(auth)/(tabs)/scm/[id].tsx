import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/context/ctx';
import api from '@/services/api';

type Ticket = {
  id: number;
  created_at: string;
  requester: { first_name: string; last_name: string };
  client: { first_name: string; last_name: string };
  complaint: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function User() {
  const { signOut, session } = useSession();
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<Ticket>();

  const getTicketDetail = async () => {

    // Verifica se a sessão é válida. Caso contrário força a rota de login
    if (!session) {
      router.replace("/");
      return;
    }
    //   setLoading(true);
    try {
      const response = await api.get(`/complaint/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      setTicket(response.data[0]);


    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getTicketDetail();
  }, []);

  if (ticket) {
    console.log(ticket.id)
  }

  return (
    <View style={styles.container}>

      {/* Se estiver fazendo o loadig exibe o spinner */}
      {loading && (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" color="#1bb6c8" />
          <Text style={styles.messageText}>Carregando ...</Text>
        </View>
      )}

      {ticket && (
        <>
          <Text>Ticket ID: {ticket.id}</Text>
          <Text>Data de Criação: {formatDate(ticket.created_at)}</Text>
          <Text>Cliente: {ticket.client.first_name} {ticket.client.last_name}</Text>
          <Text>Reclamação: {ticket.complaint}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: '#1bb6c8',
    fontSize: 18,
    marginVertical: 10,
  },
})