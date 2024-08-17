// DeyimListe.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { useUpdateContext } from '../context/UpdateContext';
import { MaterialIcons } from '@expo/vector-icons';

const DeyimListe = ({ navigation }) => {
    const db = useSQLiteContext();
    const { onUpdateOrDelete } = useUpdateContext();

    const [idioms, setIdioms] = useState([]);
    const [filteredIdioms, setFilteredIdioms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchIdioms = useCallback(async () => {
        setLoading(true);
        try {
            const result = await db.getAllAsync('SELECT * FROM idioms');
            setIdioms(result);
            setFilteredIdioms(result);
        } catch (error) {
            console.error('Deyimler alınırken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    }, [db]);

    useFocusEffect(
        useCallback(() => {
            fetchIdioms();
        }, [fetchIdioms, onUpdateOrDelete])
    );

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text === '') {
            setFilteredIdioms(idioms);
        } else {
            const filtered = idioms.filter(idiom =>
                idiom.idiom.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredIdioms(filtered);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DeyimDetay', { idiom: item })}
        >
            <View style={styles.itemContent}>
                <Text style={styles.wordText}>{item.idiom}</Text>
                <Text style={styles.meaningText}>{item.meaning}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Deyim Eklenmemiş</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButtonIcon} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={30} color="#FFD700" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Deyim ara..."
                    value={searchTerm}
                    onChangeText={handleSearch}
                />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredIdioms}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyList}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    header: {
        marginBottom: 20,
    },
    backButtonIcon: {
        alignSelf: 'flex-start',
    },
    searchInput: {
        height: 50,
        borderColor: '#B1AFFF',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        fontSize: 16,
        marginTop: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    item: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#B1AFFF',
    },
    meaningText: {
        fontSize: 16,
        color: '#FFD700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
    },
});

export default DeyimListe;
