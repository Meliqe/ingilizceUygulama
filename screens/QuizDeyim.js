import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');


const QuizDeyim = ({ navigation }) => {
    const db = useSQLiteContext();
    const [questions, setQuestions] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [error, setError] = useState('');
    const [quizStarted, setQuizStarted] = useState(false);

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const idioms = await db.getAllAsync('SELECT * FROM idioms ORDER BY RANDOM() LIMIT 15');
            if (idioms.length < 15) {
                setError('Veritabanında yeterli deyim bulunmuyor.');
                return;
            }

            const questions = await Promise.all(idioms.map(async (idiom) => {
                const sameIdiomMeanings = await db.getAllAsync('SELECT meaning FROM idioms WHERE idiom = ?', [idiom.idiom]);
                let options = [idiom.meaning];

                while (options.length < 4) {
                    const randomIdiom = idioms[Math.floor(Math.random() * idioms.length)];
                    if (!sameIdiomMeanings.some(m => m.meaning === randomIdiom.meaning) && !options.includes(randomIdiom.meaning)) {
                        options.push(randomIdiom.meaning);
                    }
                }
                options = options.sort(() => Math.random() - 0.5);

                return {
                    idiom,
                    options: options.map((option) => ({
                        meaning: option,
                        isCorrect: option === idiom.meaning,
                    })),
                };
            }));

            setQuestions(questions);
        } catch (error) {
            setError('Soruları getirirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [db]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (currentQuestionIndex >= 15) {
        }
    }, [currentQuestionIndex]);

    const handleAnswer = (isCorrect, optionIndex) => {
        if (userAnswer !== null) return;

        if (!isCorrect) {
            setIncorrectAnswers(prev => [
                ...prev,
                {
                    question: questions[currentQuestionIndex],
                    selectedIndex: optionIndex
                }
            ]);
        }

        setUserAnswer({
            selectedIndex: optionIndex,
            isCorrect: isCorrect,
        });

        setTimeout(() => {
            setUserAnswer(null);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }, 500);
    };

    const renderQuestion = () => {
        if (questions.length === 0 || currentQuestionIndex >= 15) return null;

        const currentQuestion = questions[currentQuestionIndex];

        return (
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>"{currentQuestion.idiom.idiom}" deyiminin anlamı nedir?</Text>
                {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            userAnswer !== null && index === userAnswer.selectedIndex && styles.optionButtonActive,
                            userAnswer !== null && index === userAnswer.selectedIndex && userAnswer.isCorrect ? styles.optionButtonCorrect : userAnswer !== null && index === userAnswer.selectedIndex ? styles.optionButtonWrong : null
                        ]}
                        onPress={() => handleAnswer(option.isCorrect, index)}
                        disabled={userAnswer !== null}
                    >
                        <Text style={styles.optionText}>{option.meaning}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderCompletionSummary = () => {
        return (
            <View style={styles.completedContainer}>
                <Text style={styles.completedText}> Test Tamamlandı!</Text>
                {incorrectAnswers.length > 0 ? (
                    <>
                        <Text style={styles.incorrectTitle}>Hatalı Cevaplanan Sorular:</Text>
                        <FlatList
                            data={incorrectAnswers}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.incorrectItem}>
                                    <Text style={styles.incorrectQuestionText}>
                                        "{item.question.idiom.idiom}" deyiminin anlamı nedir?
                                    </Text>
                                    <View style={styles.incorrectAnswerContainer}>
                                        <View style={styles.incorrectAnswerBox}>
                                            <Text style={styles.correctAnswerText}>
                                                Doğru Cevap: {item.question.options.find(option => option.isCorrect).meaning}
                                            </Text>
                                        </View>
                                        <View style={styles.incorrectAnswerBox}>
                                            <Text style={styles.userAnswerText}>
                                                Verdiğiniz Cevap: {item.question.options[item.selectedIndex].meaning}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            contentContainerStyle={styles.incorrectList}
                        />
                    </>
                ) : (
                    <Text style={styles.incorrectSummaryText}>Tüm soruları doğru cevapladınız!</Text>
                )}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Anasayfa')}
                >
                    <Text style={styles.backButtonText}>Geri Dön</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderError = () => {
        return (
            <View style={styles.errorContainer}>
                <LottieView
                    source={require('../assets/animations/Loading.json')}
                    autoPlay
                    loop
                    style={[styles.errorAnimation, { width: width * 0.6, height: height * 0.3 }]}
                />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButtonIcon} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={30} color="#FFD700" />
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {error ? (
                        renderError()
                    ) : (
                        !quizStarted ? (
                            <View style={styles.startContainer}>
                                <TouchableOpacity
                                    style={styles.startButton}
                                    onPress={() => setQuizStarted(true)}
                                >
                                    <Text style={styles.startButtonText}>Teste Başla</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            currentQuestionIndex < 15 ? renderQuestion() : renderCompletionSummary()
                        )
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
        position: 'relative',
    },
    backButtonIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    questionContainer: {
        flex: 1,
        width: '100%',
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    optionButton: {
        backgroundColor: '#ffffff',
        borderColor: '#B1AFFF',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        width: '80%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    optionButtonActive: {
        opacity: 0.8,
    },
    optionButtonCorrect: {
        backgroundColor: '#98FB98',
    },
    optionButtonWrong: {
        backgroundColor: '#FF6347',
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    completedContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
    },
    completedText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B1AFFF',
        marginVertical: 20,
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    incorrectTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    incorrectItem: {
        marginBottom: 20,
        padding: 15,
        borderColor: '#B1AFFF',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    incorrectQuestionText: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 10,
        fontFamily: 'poppins-regular',
    },
    incorrectAnswerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    incorrectAnswerBox: {
        backgroundColor: '#B1AFFF',
        borderRadius: 5,
        padding: 8,
        flex: 1,
        marginHorizontal: 5,
        borderColor: '#ffffff',
    },
    correctAnswerText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'poppins-regular',
    },
    userAnswerText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'poppins-regular',
    },
    incorrectList: {
        marginTop: 20,
    },
    incorrectSummaryText: {
        fontSize: 16,
        color: '#B0B0B0',
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    backButton: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'poppins-regular',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorAnimation: {
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#B1AFFF',
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
    startButton: {
        backgroundColor: '#B1AFFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    startButtonText: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'poppins-regular',
    },
});
export default QuizDeyim;
