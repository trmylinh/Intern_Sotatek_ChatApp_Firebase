/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export const LogIn = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const logIn = async () => {
        if (email === '' || password === '') {
            setError(!error);
            return;
        }
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);

        } catch (e) {
            setError(!error);
        }
    };
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>Log In</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.button} onPress={logIn}>
                    <Text style={styles.textLogIn}> Log In</Text>
                </TouchableOpacity>
                {error && <Text style={{ color: 'red' }}>Something went wrong</Text>}
                <View style={styles.footerView}>
                    <Text style={styles.textFooter}>Don't have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.textRegisterFooter} onPress={() => navigation.navigate('Register')}>Register</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <StatusBar barStyle="light-content" />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'orange',
        alignSelf: 'center',
        paddingBottom: 24,
    },
    input: {
        backgroundColor: '#F6F7FB',
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
    },
    backImage: {
        width: '100%',
        height: 340,
        position: 'absolute',
        top: 0,
        resizeMode: 'cover',
    },
    whiteSheet: {
        width: '100%',
        height: '75%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 60,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: '#f57c00',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    textLogIn: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 18,
    },
    footerView: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    textFooter: {
        color: 'gray',
        fontWeight: '600',
        fontSize: 14,
    },
    textRegisterFooter: {
        color: '#f57c00',
        fontWeight: '600',
        fontSize: 14,
    },
});


