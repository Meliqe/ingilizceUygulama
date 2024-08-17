import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
import { removeItem } from '../utils/asyncStorage';
import { resetDatabase } from '../database/reset';
import { getRandomWord, getRandomIdiom, openDatabase } from '../database/database';
import PagerView from 'react-native-pager-view';

const Anasayfa = () => {
    const navigation = useNavigation();
    const [randomWord, setRandomWord] = useState(null);
    const [randomIdiom, setRandomIdiom] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const db = await openDatabase();
            const word = await getRandomWord(db);
            const idiom = await getRandomIdiom(db);
            setRandomWord(word);
            setRandomIdiom(idiom);
        } catch (error) {
            console.error('Veri çekme sırasında bir hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDatabaseReset = async () => {
        try {
            await resetDatabase();
            console.log('Veritabanı sıfırlandı.');
        } catch (error) {
            console.error('Veritabanı sıfırlama sırasında bir hata oluştu:', error);
        }
    };

    const handleOnboardingReset = async () => {
        try {
            await removeItem('onboarded');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'OnboardingScreen' }],
                })
            );
        } catch (error) {
            console.error('Onboarding sıfırlama sırasında bir hata oluştu:', error);
        }
    };

    const handleNavigation = (screenName) => {
        navigation.navigate(screenName);
    };

    const carouselItems = [
        { title: 'Kelime Ekle', screenName: 'KelimeEkle', color: '#FFDDC1' },
        { title: 'Deyim Ekle', screenName: 'DeyimEkle', color: '#C1E1C1' },
        { title: 'Kelime Quizi', screenName: 'Quiz', color: '#C1D3F1' },
        { title: 'Deyim Quizi', screenName: 'QuizDeyim', color: '#F1C1C1' },
        { title: 'Kelimeler', screenName: 'Liste', color: '#E1C1F1' },
        { title: 'Deyimler', screenName: 'DeyimListe', color: '#C1F1E1' },
    ];

    const formatHeaderText = (text, highlightChars) => {
        if (!text) return text;
        return text.split('').map((char, index) => (
            <Text key={index} style={highlightChars.includes(char) ? styles.headerTextHighlight : styles.headerTextRest}>
                {char}
            </Text>
        ));
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.pagerContainer}>
                    <PagerView style={styles.pagerView} initialPage={0}>
                        {carouselItems.map((item, index) => (
                            <View style={[styles.page, { backgroundColor: item.color }]} key={index}>
                                <View
                                    style={styles.pageContent}
                                    onTouchEnd={() => handleNavigation(item.screenName)}
                                >
                                    <Text style={styles.pageText}>{item.title}</Text>
                                </View>
                            </View>
                        ))}
                    </PagerView>
                    <View style={styles.arrowContainer}>
                        <Image source={require('../assets/arrow.png')} style={styles.arrow} />
                    </View>
                </View>

                <View style={styles.componentsContainer}>
                    <View style={styles.componentBox}>
                        <Text style={styles.headerText}>
                            {formatHeaderText('Günün Kelimesi', ['G', 'K'])}
                        </Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Kelime:</Text> {randomWord?.english_word}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Anlamı:</Text> {randomWord?.meaning}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Düzey:</Text> {randomWord?.level}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Bir Cümle:</Text> {randomWord?.usage_sentence}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Cümle Anlamı:</Text> {randomWord?.usage_sentence_meaning}</Text>
                    </View>
                    <View style={styles.componentBox}>
                        <Text style={styles.headerText}>
                            {formatHeaderText('Günün Deyimi', ['G', 'D'])}
                        </Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Deyim:</Text> {randomIdiom?.idiom}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Anlamı:</Text> {randomIdiom?.meaning}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Bir Cümle:</Text> {randomIdiom?.usage_sentence}</Text>
                        <Text style={styles.componentText}><Text style={styles.label}>Cümle Anlamı:</Text> {randomIdiom?.usage_sentence_meaning}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Anasayfa;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    navbar: {
        height: 60,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 'auto'
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagerView: {
        height: 300,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'poppins-bold',
    },
    pagerContainer: {
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 20,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
    arrow: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    componentsContainer: {
        padding: 15,
    },
    componentBox: {
        backgroundColor: '#B1AFFF',
        borderRadius: 10,
        padding: 20,
        marginVertical: 15,
        justifyContent: 'center',
        elevation: 5,
    },
    componentText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'poppins-lightitalic',
    },
    headerText: {
        fontSize: 20,
        fontFamily: 'poppins-bold',
        marginBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    headerTextHighlight: {
        color: '#FFD700',
        fontSize: 20,
        fontFamily: 'poppins-bold',
    },
    headerTextRest: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'poppins-bold',
    },
    label: {
        fontStyle: 'italic',
        color: '#FFD700',
    },
});
