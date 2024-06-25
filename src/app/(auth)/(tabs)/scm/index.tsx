import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, View, Text } from "react-native";
import { useSession } from "@/context/ctx";
import { Link, router } from "expo-router";
import api from '@/services/api';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

type Item = {
  label: string;
  value: string;
};

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
  const [selectedValue, setSelectedValue] = useState<string | null>('1');
  const [selectedLabel, setSelectedLabel] = useState<string>('Abertos');
  const [isFocus, setIsFocus] = useState<boolean>(false);


  const getTickets = async () => {

    // Verifica se a sessão é válida. Caso contrário força a rota de login
    if (!session) {
      router.replace("/");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/complaint/get/?status=${selectedValue}`, {
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

  useEffect(() => {
    getTickets();
  }, [selectedValue]);
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.messageText}>SCM Mallon</Text> */}

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#1bb6c8' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={[
          { label: 'Abertos', value: '1' },
          { label: 'Em Andamento', value: '2' },
          { label: 'Pendentes', value: '3' },
          { label: 'Solucionados', value: '4' },
          { label: 'Cancelados', value: '5' },
          { label: 'Todos', value: '1,2,3,4,5' },
        ]}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={selectedLabel}
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item: Item) => {
          setSelectedValue(item.value);
          setSelectedLabel(item.label);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            // color={isFocus ? '#1bb6c8' : 'black'}
            name={isFocus ? "menufold" : "menuunfold"}
            size={25}
          />
        )}
      />
      {/* Se estiver fazendo o loadig exibe o spinner */}
      {loading && (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FAFAFA" />
          <Text style={styles.messageText}>Carregando ...</Text>
        </View>
      )}
      {/* Se já tiver concluído o loading dos dados vai exibi-los aqui */}
      {!loading && (
        <FlatList
          style={styles.flatlist}
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
                  {item.complaint.length > 90 ? `${item.complaint.replace(/\n/g, ' ').slice(0, 90)}...` : item.complaint}
                </Text>
              </View>
              <View style={styles.columnEnd}>
                <TouchableOpacity style={styles.editButton} onPress={() => { /* Função para editar */ }}>
                  <Link href={`/scm/${item.id}`}>
                    <FontAwesomeIcon name="edit" size={25} color="#1bb6c8" />
                  </Link>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />)}
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
  flatlist: {
    marginLeft: 8
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
    marginHorizontal: 10,
  },
  dropdown: {
    width: '95%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 8,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#1699B4',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },

});
