import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  account: undefined; 
  signup: undefined; 
  index:undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'signup'>;

const Signup: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <ImageBackground
      source={require('@/assets/images/background2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/signup1.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to React Native!</Text>
          <Text style={styles.subtitle}>Sign up to begin</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Your name"
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Your email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirm password"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('index')}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>

          <View style={styles.noAccountContainer}>
            <Text style={styles.noAccount}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('account')}>
              <Text style={styles.signUpText}>Log in</Text>
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
}

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
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
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
  signUpText: {
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

export default Signup;
