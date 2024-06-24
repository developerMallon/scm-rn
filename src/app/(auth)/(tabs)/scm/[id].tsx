import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/context/ctx';
import api from '@/services/api';
import formatDate from '@/services/formatDate'
import TruncatedText from '@/components/TruncatedText';
import FieldShowText from '@/components/FieldShowText';
import ExpandableView from '@/components/ExpandableView';
import AntDesign from '@expo/vector-icons/AntDesign';
import { encode } from 'base-64';
import * as FileSystem from 'expo-file-system';
import InputModal from '@/components/inputModal';
import updateFollowUP from '@/services/updateFollowUP';
import getTicketFiles from '@/services/getTicketFiles'
import getTicketDetails from '@/services/getTicketDetails';

export default function Ticket() {
  const { signOut, session } = useSession();
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketFiles, setTicketFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean[]>([]);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);


  useEffect(() => {
    // Verifica se a sessão é válida. Caso contrário força a rota de login
    if (!session) {
      router.replace("/");
      return;
    }

    const ticketDetails = async () => {
      setLoading(true);
      const details = await getTicketDetails(id as string, session?.access_token as string);
      setTicket(details)
      console.log(details)
    }

    const ticketFilesName = async () => {
      setLoading(true);
      const files = await getTicketFiles(id as string, session?.access_token as string);
      setTicketFiles(files);
      setLoadingFiles(Array(files.length).fill(false));
      setLoading(false);
    }

    ticketDetails()
    ticketFilesName()

  }, [id]);


  const handleFilePress = async (ticket_id: number, filename: string, index: number) => {
    try {
      setLoadingFiles(prevLoadingFiles => {
        const newLoadingFiles = [...prevLoadingFiles];
        newLoadingFiles[index] = true;
        return newLoadingFiles;
      });

      const response = await api.get(`/tickets/${ticket_id}/download/${filename}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        responseType: 'arraybuffer', // importante para baixar arquivos
      });

      // Verifique o tamanho do arquivo antes de prosseguir
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

      if (response.data.byteLength > MAX_FILE_SIZE) {
        throw new Error("File too large to process");
      }

      // Converte arraybuffer para Uint8Array
      const uint8Array = new Uint8Array(response.data);

      // Converte Uint8Array para string usando método mais eficiente
      const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
      const base64String = encode(binaryString);


      // Cria um URI local para o arquivo
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      // Escreve os dados base64 no arquivo
      await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setLoadingFiles(prevLoadingFiles => {
        const newLoadingFiles = [...prevLoadingFiles];
        newLoadingFiles[index] = false;
        return newLoadingFiles;
      });

      // Navega para o visualizador de documentos e passa o URI
      router.replace({
        pathname: `/scm/files_page`,
        params: { ticket_id: ticket_id, uri: fileUri, name: filename }
      });

    } catch (error) {
      setLoadingFiles(prevLoadingFiles => {
        const newLoadingFiles = [...prevLoadingFiles];
        newLoadingFiles[index] = false;
        return newLoadingFiles;
      });

      console.error("Error downloading file:", error);
    }
  };


  // Estados para manipulação dos popups de adição de Parecer Ténico e Followups
  const handleAddReport = () => {
    setIsCommentModalVisible(true);
  };
  const handleAddFollowUp = () => {
    setIsFollowUpModalVisible(true);
  };

  // Método para inserir um novo PARECER TÉCNICO no banco de dados
  const handleSaveReport = (report: string) => {
    if (report) {
      alert(report)
      return
    }
  };

  // Método para inserir um novo ACOMPANHAMENTO (FOLLOWUP) no banco de dados
  const handleSaveFollowUp = (followUp: string) => {
    if (followUp) {
      // updateFollowUP(followUp)
      alert(followUp)
      return
    }
  };


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

            {/* {ticket.technical_reports[0] && ( */}
              <ExpandableView title="Parecer Técnico">
                {ticket.technical_reports[0] && (
                  <View style={styles.row}>
                    <TruncatedText
                      title={`${formatDate(ticket.technical_reports[0].created_at)} - ${ticket.technical_reports[0].user.first_name} ${ticket.technical_reports[0].user.last_name}`}
                      text={ticket.technical_reports[0].details} />
                  </View>
                )}
                <Pressable style={styles.addButton} onPress={handleAddReport}>
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </Pressable>
                <InputModal
                  isVisible={isCommentModalVisible}
                  onClose={() => setIsCommentModalVisible(false)}
                  onSave={handleSaveReport}
                  title="Adicionar Parecer Técnico"
                  placeholder="Descreva o parecer técnico sobre o problema."
                />
              </ExpandableView>
            {/* )} */}

            {/* {ticket.follow_ups[0] && ( */}
              <ExpandableView title="Acompanhamentos SCM">
                {ticket?.follow_ups.map((followUp, index) => (
                  <View key={index} style={styles.row}>
                    <TruncatedText
                      title={`${formatDate(followUp.created_at)} - ${followUp.user.first_name} ${followUp.user.last_name}`}
                      text={followUp.details}
                    />
                  </View>
                ))}
                <Pressable style={styles.addButton} onPress={handleAddFollowUp}>
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </Pressable>
                <InputModal
                  isVisible={isFollowUpModalVisible}
                  onClose={() => setIsFollowUpModalVisible(false)}
                  onSave={handleSaveFollowUp}
                  title="Adicionar acompanhamento"
                  placeholder="Descreva o acompanhamento."
                />
              </ExpandableView>
            {/* )} */}

            {/* {ticketFiles.length > 0 && ( */}
              <ExpandableView title="Arquivos">
                {ticketFiles.map((name, index) => (
                  <Pressable key={index} onPress={() => handleFilePress(ticket.id, name, index)}>
                    <View style={styles.row}>
                      <Text>{name}</Text>
                      {loadingFiles[index] ?
                        (<ActivityIndicator style={styles.indicator} animating={true} color='#1bb6c8' />) :
                        (<AntDesign style={styles.downloadIcon} name='clouddownload' size={30} color="#1bb6c8" />)}
                    </View>
                  </Pressable>
                ))}
                <Pressable style={styles.addButton} onPress={handleAddReport}>
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </Pressable>
                <InputModal
                  isVisible={isCommentModalVisible}
                  onClose={() => setIsCommentModalVisible(false)}
                  onSave={handleSaveReport}
                  title="Adicionar Arquivos"
                  placeholder="Selecione o arquivo e clique em enviar."
                />
              </ExpandableView>
            {/* )} */}

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
  fileNames: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    marginVertical: 2
  },
  downloadIcon: {
    marginRight: 10
  },
  indicator: {
    marginRight: 15,
    paddingVertical: 5
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#1bb6c8',
    marginVertical: 10,
    marginLeft: 20,
  }
});
