import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Modal, SafeAreaView, Text, View, Alert, TouchableWithoutFeedback  } from 'react-native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const index = () => {
    const [visible, setVisible] = useState(false)

    const options = [
        {
            title: 'Aberto',
            icon: 'archive-lock-open-outline',
            action: () => Alert.alert('Aberto')
        },
        {
            title: 'Em Andamento',
            icon: 'archive-clock-outline',
            action: () => Alert.alert('Em Andamento')
        },
        {
            title: 'Pendente',
            icon: 'archive-edit-outline',
            action: () => Alert.alert('Pendente')
        },
        {
            title: 'Solucionado',
            icon: 'archive-check-outline',
            action: () => Alert.alert('Solucionado')
        },
        {
            title: 'Cancelado',
            icon: 'archive-cancel-outline',
            action: () => Alert.alert('Cancelado')
        },
    ]

    return (
        <>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Icon name="plus-circle-outline" size={26} color='#1bb6c8' />
            </TouchableOpacity>

            <Modal transparent visible={visible}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.popup}>
                            {options.map((option, index) => (
                                <TouchableOpacity style={styles.option} key={index} onPress={() => { option.action(); setVisible(false) }}>
                                    <Text>{option.title}</Text>
                                    <Icon style={styles.icon} name={option.icon} size={26} color='#1bb6c8' />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

export default index

const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        borderColor: '#999',
        borderWidth: 1,
        backgroundColor: '#fafafa',
        paddingHorizontal: 10,
        paddingVertical: 10,
        position: 'absolute',
        top: 78,
        right: 20,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc'
    },
    icon: {
        marginLeft: 10
    }
})