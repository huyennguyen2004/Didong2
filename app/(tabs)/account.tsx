import { Image, StyleSheet, ImageBackground, View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Profile: { username: string } | undefined; 
  Signup: undefined;
};

const Account: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        navigation.navigate('Profile', { username: email }); 
      } else {
        Alert.alert('Error', data.message || 'Invalid email or password.');
      }

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/login.png')}
            style={styles.reactLogo}
          />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subTitle}>Please sign in to continue</Text>

          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email or username"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />

          <Text style={styles.forgotPassword}>Forgot password?</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin} 
          >
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <View style={styles.noAccountContainer}>
            <Text style={styles.noAccount}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signInText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <Text>Or connect with</Text>

          <View style={styles.socialIcons}>
            <Image source={require('@/assets/images/facebook.png')} style={styles.icon} />
            <Image source={require('@/assets/images/google.png')} style={styles.icon} />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  reactLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  forgotPassword: {
    color: '#007BFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  noAccountContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  noAccount: {
    marginRight: 5,
  },
  signInText: {
    color: '#007BFF',
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
});

export default Account;
