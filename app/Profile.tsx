import React from 'react';
import { View, Text, StyleSheet, Pressable,ImageBackground } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Profile: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { params } = route as { params?: { username?: string } };

  return (
    <ImageBackground
    source={require('@/assets/images/background3.jpg')}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text style={styles.username}>
        {params?.username ? `Hello, ${params.username}!` : "Welcome to your profile!"}
      </Text>
      
      <Pressable style={styles.button} onPress={() => navigation.navigate('index')}>
        <Text style={styles.buttonText}>Return Home</Text>
      </Pressable>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Profile;
