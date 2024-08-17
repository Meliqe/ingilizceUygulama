import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Modal, FlatList, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { updateWord, deleteWord } from '../database/database';
import { useNavigation } from '@react-navigation/native';
import { useUpdateContext } from '../context/UpdateContext';
import { MaterialIcons } from '@expo/vector-icons';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const KelimeDetay = ({ route }) => {
    const { word } = route.params;
    const { setOnUpdateOrDelete } = useUpdateContext();
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const [wordText, setWordText] = useState(word.english_word);
    const [meaning, setMeaning] = useState(word.meaning);
    const [level, setLevel] = useState(word.level);
    const [usage, setUsage] = useState(word.usage_sentence);
    const [usageMeaning, setUsageMeaning] = useState(word.usage_sentence_meaning);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleUpdateWord = async () => {
        setLoading(true);
        try {
            await updateWord(db, word.id, wordText, meaning, level, usage, usageMeaning);
            if (setOnUpdateOrDelete) setOnUpdateOrDelete();
            navigation.goBack();
        } catch (error) {
            console.error('Kelimeler güncellenirken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWord = async () => {
        setLoading(true);
        try {
            await deleteWord(db, word.id);
            if (setOnUpdateOrDelete) setOnUpdateOrDelete();
            navigation.goBack();
        } catch (error) {
            console.error('Kelimeler silinirken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLevelSelect = (selectedLevel) => {
        setLevel(selectedLevel);
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={30} color="#FFD700" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Kelime"
                        value={wordText}
                        onChangeText={setWordText}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Anlamı"
                        value={meaning}
                        onChangeText={setMeaning}
                    />
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.inputText}>{level || 'Düzey Seçin'}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Bir Cümle"
                        value={usage}
                        onChangeText={setUsage}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Cümlenin Anlamı"
                        value={usageMeaning}
                        onChangeText={setUsageMeaning}
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateWord}>
                                <Text style={styles.updateButtonText}>Güncelle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteWord}>
                                <Text style={styles.deleteButtonText}>Sil</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={LEVELS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.modalItem,
                                        pressed && styles.modalItemPressed
                                    ]}
                                    onPress={() => handleLevelSelect(item)}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 50,
    },
    form: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    input: {
        height: 60,
        width: '100%',
        borderColor: '#B1AFFF',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        fontSize: 18,
        justifyContent: 'center',
    },
    inputText: {
        color: 'black',
        fontSize: 18,
    },
    updateButton: {
        backgroundColor: '#B1AFFF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalItem: {
        paddingVertical: 20,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#B1AFFF',
    },
    modalItemText: {
        fontSize: 18,
        color: 'black',
    },
    modalItemPressed: {
        backgroundColor: 'rgba(177, 168, 255, 0.3)',
    },
});

export default KelimeDetay;
