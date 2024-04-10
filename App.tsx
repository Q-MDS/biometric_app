import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pages/login/Login';
import Mainmenu from './src/pages/mainmenu/Mainmenu';

const Stack = createStackNavigator();

function App(): React.JSX.Element 
{
	return (
	<NavigationContainer>
		<Stack.Navigator initialRouteName="Login">
		<Stack.Screen name="Login" component={Login} />
		<Stack.Screen name="Mainmenu" component={Mainmenu} />
		</Stack.Navigator>
	</NavigationContainer>

	);
}

export default App;
