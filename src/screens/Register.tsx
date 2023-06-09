/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { app, auth, db, storage } from '../config/firebase';

import DocumentPicker from 'react-native-document-picker';
import { ref,getDownloadURL, uploadBytes } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
export const Register = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [error, setError] = useState(false);

    const choosePhotoFromLibrary = async () => {
        const result = await DocumentPicker.pickSingle({
            allowMultiSelection: false,
            type: DocumentPicker.types.images,
        });
        if (result) {
            setPhotoURL(result.uri);
        }
    };

    const register = async () => {
        if (email === '' || password === '') {
            setError(!error);
            return;
        }
        try {
            // create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //upload image
            if (!photoURL) {
                return null;
            }
            const uploadUri = photoURL;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
            // add timestamp to filename
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;

            const storageRef = ref(storage, `photos/${filename}`);
            const img = await fetch(photoURL);
            const bytes = await img.blob();
            await uploadBytes(storageRef, bytes).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });

                        //create user on firestore
                        await setDoc(doc(db, 'users', res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        //create empty user chats on firestore
                        await setDoc(doc(db, 'userChats', res.user.uid), {});
                    } catch (e: any) {
                        console.log(e.message);
                    }
                });
            });
            navigation.navigate('LogIn');
        } catch (e) {
            setError(!error);
        }
    };
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter display name"
                    autoCapitalize="none"
                    textContentType="name"
                    value={displayName}
                    onChangeText={(text) => setDisplayName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
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
                <TouchableOpacity style={styles.buttonAdd} onPress={choosePhotoFromLibrary}>
                    <Text style={styles.textLogIn}>Add an avatar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={register}>
                    <Text style={styles.textLogIn}>Register</Text>
                </TouchableOpacity>
                {error && <Text style={{ color: 'red' }}>Something went wrong</Text>}
                <View style={styles.footerView}>
                    <Text style={styles.textFooter}>Have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.textRegisterFooter} onPress={() => navigation.navigate('LogIn')}>LogIn</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
        // flex: 1,
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
        paddingHorizontal: 30,
        width: '100%',
        height: '75%',
    },
    button: {
        backgroundColor: '#f57c00',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    buttonAdd: {
        backgroundColor: '#EECBAD',
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


