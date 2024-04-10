import React from 'react';
import { View, Text, Button } from 'react-native';

const Mainmenu = (props: any) => 
{
  return (
	<View>
		<Text>Login</Text>
		<Button title="Go to Login" onPress={() => props.navigation.navigate('Login')} />
	</View>
  )
}

export default Mainmenu
