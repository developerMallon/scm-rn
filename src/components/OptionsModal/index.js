import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Modal, SafeAreaView, Text, View, Alert, TouchableWithoutFeedback } from 'react-native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const OptionsModal = ({ visible, setVisible, options, top, right }) => {
    return (
        <>
            <Modal transparent visible={visible}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={[styles.popup, {top: top, right: right}]}>
                            {options.map((option, index) => (
                                <TouchableOpacity style={[
                                    styles.option, {
                                    borderBottomWidth: index === options.length - 1 ? 0 : 1
                                    }]} 
                                    key={index} onPress={
                                        () => { option.action(); setVisible(false) 
                                    }}>
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

export default OptionsModal

const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        borderColor: '#999',
        borderWidth: 1,
        backgroundColor: '#fafafa',
        paddingHorizontal: 10,
        paddingVertical: 10,
        position: 'absolute',
        // top: 78,
        // right: 20, serão passado via props
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc'
    },
    icon: {
        marginLeft: 20
    }
})