import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { insertWord, checkWordExists } from '../database/database';

export default function KelimeEkle() {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [level, setLevel] = useState('A1');
    const [usage, setUsage] = useState('');
    const [usageMeaning, setUsageMeaning] = useState('');
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleAddWord = async () => {
        if (!word.trim() || !meaning.trim() || !level.trim()) {
            Alert.alert('Hata', 'Tüm alanları doldurmalısınız.', [{ text: 'Tamam', style: 'cancel' }]);
            return;
        }

        const exists = await checkWordExists(db, word, meaning);
        if (exists) {
            Alert.alert('Hata', 'Bu kelime zaten mevcut.', [{ text: 'Tamam', style: 'cancel' }]);
            return;
        }

        await insertWord(db, word, meaning, level, usage, usageMeaning);
        setWord('');
        setMeaning('');
        setLevel('A1');
        setUsage('');
        setUsageMeaning('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={30} color="#FFD700" />
            </TouchableOpacity>
            <View style={styles.formContainer}>
                <Text style={styles.header}>Yeni Kelime Ekle</Text>
                <TextInput
                    style={styles.input}
                    placeholder="İngilizce Kelime"
                    placeholderTextColor="#888"
                    value={word}
                    onChangeText={setWord}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Anlamı"
                    placeholderTextColor="#888"
                    value={meaning}
                    onChangeText={setMeaning}
                />
                <TouchableOpacity
                    style={styles.pickerContainer}
                    onPress={() => setPickerVisible(true)}
                >
                    <Text style={styles.pickerText}>{level}</Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Bir Cümle"
                    placeholderTextColor="#888"
                    value={usage}
                    onChangeText={setUsage}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Cümlenin Anlamı"
                    placeholderTextColor="#888"
                    value={usageMeaning}
                    onChangeText={setUsageMeaning}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleAddWord}>
                    <Text style={styles.submitButtonText}>Kelime Ekle</Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isPickerVisible}
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setPickerVisible(false)}>
                    <View style={styles.modalContainer}>
                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((item) => (
                            <Pressable
                                key={item}
                                style={({ pressed }) => [
                                    styles.modalItem,
                                    pressed && styles.modalItemPressed
                                ]}
                                onPress={() => {
                                    setLevel(item);
                                    setPickerVisible(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>{item}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontFamily: 'poppins-bold',
        marginBottom: 20,
        color: '#B1AFFF',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#B1AFFF',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#B1AFFF',
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        justifyContent: 'space-between',
    },
    pickerText: {
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'poppins-bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalItemPressed: {
        backgroundColor: 'rgba(177, 168, 255, 0.3)',
    },
});
