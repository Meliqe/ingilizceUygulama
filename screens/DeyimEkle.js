import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { insertIdioms, checkIdiomExists } from '../database/database';
import { MaterialIcons } from '@expo/vector-icons';

export default function DeyimEkle() {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const [idiom, setIdiom] = useState('');
    const [meaning, setMeaning] = useState('');
    const [usage, setUsage] = useState('');
    const [usageMeaning, setUsageMeaning] = useState('');

    const handleAddIdiom = async () => {
        if (!idiom.trim() || !meaning.trim()) {
            Alert.alert('Hata', 'Tüm alanları doldurmalısınız.', [{ text: 'Tamam', style: 'cancel' }]);
            return;
        }

        const exists = await checkIdiomExists(db, idiom, meaning);
        if (exists) {
            Alert.alert('Hata', 'Bu deyim zaten mevcut.', [{ text: 'Tamam', style: 'cancel' }]);
            return;
        }

        await insertIdioms(db, idiom, meaning, usage, usageMeaning);
        setIdiom('');
        setMeaning('');
        setUsage('');
        setUsageMeaning('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={30} color="#FFD700" />
            </TouchableOpacity>
            <View style={styles.formContainer}>
                <Text style={styles.header}>Yeni Deyim Ekle</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Deyim"
                    placeholderTextColor="#888"
                    value={idiom}
                    onChangeText={setIdiom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Anlamı"
                    placeholderTextColor="#888"
                    value={meaning}
                    onChangeText={setMeaning}
                />
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
                <TouchableOpacity style={styles.submitButton} onPress={handleAddIdiom}>
                    <Text style={styles.submitButtonText}>Deyim Ekle</Text>
                </TouchableOpacity>
            </View>
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
});
