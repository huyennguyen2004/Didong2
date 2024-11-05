import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/(tabs)/index.js';
import ProductDetail from './app/ProductDetail.js';
import Profile from './app/Profile.js';


const Stack = createStackNavigator();

const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen name="index" component={Home} />
        <Stack.Screen name="ProductDetail" component={ProductDetail}/>
        <Stack.Screen name="Profile" component={Profile} />
     </Stack.Navigator>

     <Stack.Navigator initialRouteName="Account">
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Profile" component={Profile} /> 
    </Stack.Navigator>

    </NavigationContainer>
  );
}