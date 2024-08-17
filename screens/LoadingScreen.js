import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get('window');
const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/animations/Loading.json')}
                autoPlay
                loop
                style={[styles.animation, { width: width * 0.6, height: height * 0.3 }]}
            />
            <Text style={styles.text}>Yükleniyor...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    animation: {
        width: '%50',
        height: '%50',
        alignSelf: 'center',
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#B1AFFF',
        fontFamily: 'poppins-regular'
    },
});

export default LoadingScreen;
