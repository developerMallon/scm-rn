import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Alert, RefreshControl, TouchableOpacity } from 'react-native';
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
import addFollowUpService from '@/services/addFollowUpService';
import getTicketFiles from '@/services/getTicketFiles'
import getTicketDetails from '@/services/getTicketDetails';
import addReportService from '@/services/addReportService';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import OptionsModal from '@/components/OptionsModal';
import { optionsResponsible, optionsStatus, optionsType } from '@/components/Options';


export default function Ticket() {
  const { session } = useSession();
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketFiles, setTicketFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean[]>([]);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
  const [isKmHrModalVisible, setIsKmHrModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalStatusVisible, setModalStatusVisible] = useState(false)
  const [modalTypeVisible, setModalTypeVisible] = useState(false)
  const [modalResponsibleVisible, setModalResponsibleVisible] = useState(false)


  const ticketDetails = async () => {
    setLoading(true);
    const details = await getTicketDetails(id as string, session?.access_token as string);
    setTicket(details)
    setLoading(false);
  }

  const ticketFilesName = async () => {
    setLoading(true);
    const files = await getTicketFiles(id as string, session?.access_token as string);
    setTicketFiles(files);
    setLoadingFiles(Array(files.length).fill(false));
    setLoading(false);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await ticketDetails();
    await ticketFilesName();
    setRefreshing(false);
  };

  useEffect(() => {
    // Verifica se a sessão é válida. Caso contrário força a rota de login
    if (!session) {
      router.replace("/");
      return;
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


  // Método para inserir um novo PARECER TÉCNICO no banco de dados
  const handleSaveReport = async (report: string, ticketId: number) => {
    if (report) {
      try {
        await addReportService(ticketId, report, session?.access_token as string);
        // Atualiza os detalhes do ticket
        ticketDetails()
      } catch (error) {
        console.error("Erro ao salvar parecer técnico:", error);
        // Aqui você pode tratar o erro de forma adequada, como exibir um Alert
        Alert.alert("Erro", "Não foi possível salvar o parecer técnico.");
      }
    }
  };

  // Método para inserir um novo ACOMPANHAMENTO (FOLLOWUP) no banco de dados
  const handleSaveFollowUp = async (followUp: string, ticketId: number) => {
    try {
      if (followUp) {
        await addFollowUpService(ticketId, followUp, session?.access_token as string);
        // Atualiza os detalhes do ticket
        ticketDetails()
      }
    } catch (error) {
      console.error("Erro ao salvar follow-up:", error);
      // Aqui você pode tratar o erro de forma adequada, como exibir um Alert
      Alert.alert("Erro", "Não foi possível salvar o follow-up.");
    }
  };


  // Método para inserir um novo ACOMPANHAMENTO (FOLLOWUP) no banco de dados
  const handleSaveKmHr = async (km_hr: string, ticketId: number) => {
    console.log(ticketId, km_hr)
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
        <ScrollView style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>


            <View style={styles.row}>
              <FieldShowText title="Ticket:" text={ticket.id.toString()} />
              <FieldShowText title="Criado em:" text={formatDate(ticket.created_at)} />
              <Pressable style={{ flexDirection: 'row' }} onPress={() => setModalStatusVisible(true)}>
                <FieldShowText title="Status:" text={ticket.status.name} />
                <Icon name="chevron-down" size={26} color='#1bb6c8' />
              </Pressable>
              
              <OptionsModal visible={modalStatusVisible} setVisible={setModalStatusVisible} options={optionsStatus} top={100} right={30}/>
            </View>


            <View style={styles.row}>
              <FieldShowText title="Solicitante:" text={`${ticket.requester.first_name} ${ticket.requester.last_name}`} />
              
              <Pressable style={{ flexDirection: 'row' }} onPress={() => setModalTypeVisible(true)}>
                <FieldShowText title="Tipo:" text={ticket.type.name} />
                <Icon name="chevron-down" size={26} color='#1bb6c8' />
              </Pressable>
              <OptionsModal visible={modalTypeVisible} setVisible={setModalTypeVisible} options={optionsType} top={160} right={200}/>

              <Pressable style={{ flexDirection: 'row' }} onPress={() => setModalResponsibleVisible(true)}>
                <FieldShowText title="Responsável:" text={`${ticket.responsible_group.name}`} />
                <Icon name="chevron-down" size={26} color='#1bb6c8' />  
              </Pressable>
              <OptionsModal visible={modalResponsibleVisible} setVisible={setModalResponsibleVisible} options={optionsResponsible} top={160} right={50}/>
            </View>

            <View style={styles.row}>
              <FieldShowText title="Cliente:" text={`${ticket.client.first_name} ${ticket.client.last_name}`} />
              <FieldShowText title="Telefone:" text={`${ticket.client.phone}`} />
            </View>
            <View style={styles.row}>
              <FieldShowText title="Veículo:" text={ticket.vehicles[0].model} />
              <FieldShowText title="Ano/Modelo:" text={ticket.vehicles[0].year_model} />

              <Pressable style={{ flexDirection: 'row' }} onPress={() => setIsKmHrModalVisible(true)}>
                <FieldShowText title="KM/Hr:" text={ticket.km_hr} />
                <Icon name="chevron-down" size={26} color='#1bb6c8' />  
              </Pressable>
              <InputModal
                isVisible={isKmHrModalVisible}
                onClose={() => setIsKmHrModalVisible(false)}
                onSave={(report: string) => handleSaveKmHr(report, ticket.id)} 
                title="Km/Hr - (Informe o novo Km/Hr)"
                placeholder="Informe o novo KM/HR."
              />
            </View>


            <View style={styles.row}>
              <FieldShowText title="Chassi:" text={ticket.vehicles[0].vin} />
              <FieldShowText title="Placa:" text={ticket.vehicles[0].plate} />
            </View>
            <View style={styles.row}>
              <TruncatedText title="Reclamação:" text={ticket.complaint} />
            </View>

            <ExpandableView title="Parecer Técnico" count={ticket.technical_reports.length}>
              {ticket?.technical_reports.map((report, index) => (
                <View key={index} style={styles.row}>
                  <TruncatedText
                    title={`${formatDate(report.created_at)} - ${report.user.first_name} ${report.user.last_name}`}
                    text={report.details} />
                </View>
              ))}
              <Pressable style={styles.addButton} onPress={() => setIsCommentModalVisible(true)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </Pressable>
              <InputModal
                isVisible={isCommentModalVisible}
                onClose={() => setIsCommentModalVisible(false)}
                onSave={(report: string) => handleSaveReport(report, ticket.id)}
                title="Adicionar Parecer Técnico"
                placeholder="Descreva o parecer técnico sobre o problema."
              />
            </ExpandableView>

            <ExpandableView title="Acompanhamentos SCM" count={ticket.follow_ups.length}>
              {ticket?.follow_ups.map((followUp, index) => (
                <View key={index} style={styles.row}>
                  <TruncatedText
                    title={`${formatDate(followUp.created_at)} - ${followUp.user.first_name} ${followUp.user.last_name}`}
                    text={followUp.details}
                  />
                </View>
              ))}
              <Pressable style={styles.addButton} onPress={() => setIsFollowUpModalVisible(true)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </Pressable>
              <InputModal
                isVisible={isFollowUpModalVisible}
                onClose={() => setIsFollowUpModalVisible(false)}
                onSave={(followUp: string) => handleSaveFollowUp(followUp, ticket.id)}
                title="Adicionar acompanhamento"
                placeholder="Descreva o acompanhamento."
              />
            </ExpandableView>

            <ExpandableView title="Arquivos" count={ticketFiles.length}>
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
              <Pressable style={styles.addButton} onPress={() => setIsCommentModalVisible(true)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </Pressable>
              <InputModal
                isVisible={isCommentModalVisible}
                onClose={() => setIsCommentModalVisible(false)}
                onSave={(report: string) => handleSaveReport(report, ticket.id)}
                title="Adicionar Arquivos"
                placeholder="Selecione o arquivo e clique em enviar."
              />
            </ExpandableView>

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
