import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/context/ctx';
import api from '@/services/api';
import TruncatedText from '@/components/TruncatedText';
import FieldShowText from '@/components/FieldShowText';
import ExpandableView from '@/components/ExpandableView';

type FollowUp = {
  id: number
  user: Client
  created_at: string
  details: string
}

type Status = {
  id: number
  name: string
}

type ResponsibleGroup = {
  id: number
  name: string
}

type TechnicalReport = {
  id: number
  user: Client
  created_at: string
  details: string
}

type Vehicle = {
  id: string
  brand: string
  model: string
  vin: string
  plate: string
  color: string
  year_model: string
  km_hr: string
}

type Client = {
  id: number;
  first_name: string;
  last_name: string;
  cpf_cnpj: string;
  phone: string;
  email: string;
}

type Type = {
  id: number,
  name: string;
}

type Ticket = {
  id: number;
  created_at: string;
  status: Status;
  requester: { first_name: string; last_name: string; };
  responsible_group: ResponsibleGroup;
  client: Client;
  type: Type;
  km_hr: string;
  complaint: string;
  vehicles: Vehicle[];
  technical_reports: TechnicalReport[];
  follow_ups: FollowUp[];
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


  // console.log(ticket?.id)

  useEffect(() => {
    getTicketDetail();
  }, [id]);

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
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.row}>
              <FieldShowText title="Ticket:" text={ticket.id.toString()} />
              <FieldShowText title="Criado em:" text={formatDate(ticket.created_at)} />
              <FieldShowText title="Status:" text={ticket.status.name} />
            </View>
            <View style={styles.row}>
              <FieldShowText title="Solicitante:" text={`${ticket.requester.first_name} ${ticket.requester.last_name}`} />
              <FieldShowText title="Tipo:" text={ticket.type.name} />
              <FieldShowText title="Responsável:" text={`${ticket.responsible_group.name}`} />
            </View>
            <View style={styles.row}>
              <FieldShowText title="Cliente:" text={`${ticket.client.first_name} ${ticket.client.last_name}`} />
              <FieldShowText title="Telefone:" text={`${ticket.client.phone}`} />
            </View>
            <View style={styles.row}>
              <FieldShowText title="Veículo:" text={ticket.vehicles[0].model} />
              <FieldShowText title="Ano/Modelo:" text={ticket.vehicles[0].year_model} />
              <FieldShowText title="KM/Hr:" text={ticket.km_hr} />
            </View>
            <View style={styles.row}>
              <FieldShowText title="Chassi:" text={ticket.vehicles[0].vin} />
              <FieldShowText title="Placa:" text={ticket.vehicles[0].plate} />
            </View>
            <View style={styles.row}>
              <TruncatedText title="Reclamação:" text={ticket.complaint} />
            </View>

            {ticket.technical_reports[0] && (
              <ExpandableView title="Parecer Técnico">
                {ticket.technical_reports[0] && (
                  <View style={styles.row}>
                    <TruncatedText
                      title={`${formatDate(ticket.technical_reports[0].created_at)} - ${ticket.technical_reports[0].user.first_name} ${ticket.technical_reports[0].user.last_name}`}
                      text={ticket.technical_reports[0].details} />
                  </View>
                )}
              </ExpandableView>
            )}


            {ticket.follow_ups[0] && (
              <ExpandableView title="Acompanhamentos SCM">
                {ticket?.follow_ups.map((followUp, index) => (
                  <View key={index} style={styles.row}>
                    <TruncatedText
                      title={`${formatDate(followUp.created_at)} - ${followUp.user.first_name} ${followUp.user.last_name}`}
                      text={followUp.details}
                    />
                  </View>
                ))}
              </ExpandableView>
            )}





          </View>
        </ScrollView>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    marginVertical: 1,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
})