import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../utils/asyncStorage';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
    const navigation = useNavigation();

    const handleDone = async () => {
        await setItem('onboarded', '1');
        navigation.navigate('Anasayfa');
    };

    const handleSkip = async () => {
        await setItem('onboarded', '1');
        navigation.navigate('Anasayfa');
    };

    return (
        <View style={styles.container}>
            <Onboarding
                onDone={handleDone}
                onSkip={handleSkip}
                containerStyles={styles.containerStyles}
                pageContainerStyles={styles.pageContainer}
                titleStyles={styles.title}
                subTitleStyles={styles.subtitle}
                bottomBarHighlight={false}
                showSkip={true}
                showNext={true}
                showDone={true}
                skipLabel='Atla'
                nextLabel='Sonraki'
                doneLabel='Başla'
                skipButtonStyle={styles.button}
                nextButtonStyle={styles.button}
                doneButtonStyle={styles.button}
                skipButtonTextStyle={styles.buttonText}
                nextButtonTextStyle={styles.buttonText}
                doneButtonTextStyle={styles.buttonText}
                pages={[
                    {
                        backgroundColor: '#B1AFFF',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    source={require('../assets/animations/welcome.json')}
                                    autoPlay
                                    loop
                                    style={styles.lottie}
                                />
                            </View>
                        ),
                        title: 'Hoşgeldiniz',
                        subtitle: 'Uygulama, kendi İngilizce kelimelerinizi ve anlamlarını eklemenize olanak tanır. Kendi kelime listenizi oluşturun ve kişisel öğrenme deneyiminizi zenginleştirin.',
                    },
                    {
                        backgroundColor: '#B1AFFF',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    source={require('../assets/animations/americanflag.json')}
                                    autoPlay
                                    loop
                                    style={styles.lottie}
                                />
                            </View>
                        ),
                        title: 'Kelimelerle Quizler',
                        subtitle: 'Eklediğiniz kelimelerle quizler oluşturabilirsiniz. Bilgilerinizi test edin ve öğrenmenizi pekiştirin.',
                    },
                    {
                        backgroundColor: '#B1AFFF',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    source={require('../assets/animations/learning.json')}
                                    autoPlay
                                    loop
                                    style={styles.lottie}
                                />
                            </View>
                        ),
                        title: 'Kelime Listesi',
                        subtitle: 'Eklediğiniz tüm kelimeleri kolayca görebileceğiniz bir kelime listesi mevcut. Her kelimenin anlamını, kullanımını ve örnek cümlelerini burada bulabilirsiniz.',
                    },
                    {
                        backgroundColor: '#B1AFFF',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    source={require('../assets/animations/confetti.json')}
                                    autoPlay
                                    loop
                                    style={styles.lottie}
                                />
                            </View>
                        ),
                        title: 'Hazırsanız Başlayalım!',
                        subtitle: 'Kendi kelimelerinizi ekleyin, quizlerle eğlenin ve ilerlemenizi takip edin. Her şey hazır!',
                    }
                ]}
            />
        </View>
    );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerStyles: {
        paddingHorizontal: 15,
    },
    pageContainer: {
        paddingVertical: 50,
    },
    lottie: {
        width: width * 0.9,
        height: width * 0.9,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'poppins-bold',
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'poppins-regular',
    },
    button: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'poppins-regular',
    },
});
