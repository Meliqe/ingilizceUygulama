import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { updateIdiom, deleteIdiom } from '../database/database';
import { useNavigation } from '@react-navigation/native';
import { useUpdateContext } from '../context/UpdateContext';
import { MaterialIcons } from '@expo/vector-icons';

const DeyimDetay = ({ route }) => {
    const { idiom } = route.params;
    const { setOnUpdateOrDelete } = useUpdateContext();
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const [idiomText, setIdiomText] = useState(idiom.idiom);
    const [meaning, setMeaning] = useState(idiom.meaning);
    const [usage, setUsage] = useState(idiom.usage_sentence);
    const [usageMeaning, setUsageMeaning] = useState(idiom.usage_sentence_meaning);
    const [loading, setLoading] = useState(false);

    const handleUpdateIdiom = async () => {
        setLoading(true);
        try {
            await updateIdiom(db, idiom.id, idiomText, meaning, usage, usageMeaning);
            if (setOnUpdateOrDelete) setOnUpdateOrDelete(); // Listeyi güncelle
            navigation.goBack();
        } catch (error) {
            console.error('Deyim güncellenirken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteIdiom = async () => {
        setLoading(true);
        try {
            await deleteIdiom(db, idiom.id);
            if (setOnUpdateOrDelete) setOnUpdateOrDelete(); // Listeyi güncelle
            navigation.goBack();
        } catch (error) {
            console.error('Deyim silinirken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
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
                        placeholder="Deyim"
                        value={idiomText}
                        onChangeText={setIdiomText}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Anlamı"
                        value={meaning}
                        onChangeText={setMeaning}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Cümle"
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
                            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateIdiom}>
                                <Text style={styles.updateButtonText}>Güncelle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteIdiom}>
                                <Text style={styles.deleteButtonText}>Sil</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
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
});

export default DeyimDetay;
