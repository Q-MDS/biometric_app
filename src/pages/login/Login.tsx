import React, { useState, useEffect } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { register } from '../../services/auth';
import { login } from '../../services/auth';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

const Login = (props: any) => 
{
	const [isSupported, setIsSupported] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [credOne, setCredOne] = useState('peter@parker.com');
	const [credTwo, setCredTwo] = useState('123777-');

	const checkBiometrics = async () => 
	{
		rnBiometrics.isSensorAvailable()
		.then((resultObject) => 
		{
			const { available, biometryType } = resultObject

			if (available && biometryType === BiometryTypes.TouchID) 
			{
				setIsSupported(true);
				console.log('TouchID is supported');
			} 
			else if (available && biometryType === BiometryTypes.FaceID) 
			{
				setIsSupported(true);
				console.log('FaceID is supported');
			} 
			else if (available && biometryType === BiometryTypes.Biometrics) 
			{
				setIsSupported(true);
				console.log('Biometrics is supported');
			} 
			else 
			{
				setIsSupported(false);
				console.log('Biometrics not supported')
			}
		})
	}

	useEffect(() => 
	{
		checkBiometrics();
	}, []);

	useEffect(() => 
	{
		if(isSupported)
		{
			//simplePrompt();
		}
	}, [isSupported]);

	const handleRegister = async (publicKey: string, signature: string, payload: string) => 
	{
		console.log('React Native PK: ', publicKey);
		const data = 
		{
			cred_1: credOne,
			cred_2: credTwo,
			public_key: publicKey,
			signature: signature,
			payload: payload
		};

		try 
		{
			const response = await register(data);
			
			setIsRegistered(true);
		} 
		catch (err) 
		{
			console.log('Error: ', err);
			setIsRegistered(false);
		}
	}

	const simplePrompt = async () => 
	{
		const payload = Date.now().toString(); // Remove ???
		const {success} = await rnBiometrics.simplePrompt({ promptMessage: 'Confirmation', cancelButtonText: 'Cancel'});
		
		if (success) 
		{
			// console.log('successful biometrics provided');
			const {publicKey} = await rnBiometrics.createKeys();

			const {signature} = await rnBiometrics.createSignature({ payload: payload, promptMessage: 'Confirmation', }); // Remove ???
			  
			if (success) 
			{
				//... send signature and payload
				if (publicKey && signature && payload) 
				{
					handleRegister(publicKey, signature, payload); // Change ???
				} 
				else 
				{
					console.error('One or more variables are undefined');
				}
			}
		}
	}

	const loginScreen = async () => 
	{
		const payload = Date.now().toString();
		// const payload = '123';
		const {success} = await rnBiometrics.simplePrompt({ promptMessage: 'Confirmation', cancelButtonText: 'Cancel'});
		
		if (success) 
		{
			// console.log('successful biometrics provided');
			// const {publicKey} = await rnBiometrics.createKeys();

			// console.log('publicKey: ', publicKey);

			const {signature} = await rnBiometrics.createSignature({ payload: payload, promptMessage: 'Confirmation', });
			  
			if (success) 
			{
				//... send signature and payload
				if (signature && payload) 
				{
					handleLogin(signature, payload);
				} 
				else 
				{
					console.error('One or more variables are undefined');
				}
			}
		} 
		else 
		{
			console.error('Biometric not recognised');
		}
	}	

	const handleLogin = async (signature: string, payload: string) => 
	{
		// Will need to get the cred_1 and cred_2 from profile/asyn-storage
		const email = credOne;
		const password = credTwo;

		const data = 
		{
			cred_1: email,
			cred_2: password,
			signature: signature,
			payload: payload
		};

		try 
		{
			const response = await login(data);
			console.log('response ccc: ', response.status);
			if (response.status) 
			{
				setIsAuthenticated(true);
			} 
			else 
			{
				setIsAuthenticated(false);
			}
		} 
		catch (err) 
		{
			console.log('Error: ', err);
			setIsAuthenticated(false);
		}
	}

  return (
	<View style={{ flex: 1, backgroundColor: '#252525', padding: 25 }}>
		<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Please register</Text>
		<TextInput style={{ paddingStart: 10, borderRadius: 8, borderColor: 'orange', borderWidth: 1, color: 'white', marginBottom: 20 }} value={credOne} onChangeText={text => setCredOne(text)} />
		<TextInput style={{ paddingStart: 10, borderRadius: 8, borderColor: 'orange', borderWidth: 1, color: 'white', marginBottom: 20 }} value={credTwo} onChangeText={text => setCredTwo(text)} />
		{
			isSupported ? (
			<View>
				<Text>Biometrics is supported</Text>
				<TouchableOpacity style={styles.button} onPress={() => simplePrompt()}>
					<Text style={styles.buttonText}>Setup Biometric</Text>
				</TouchableOpacity>
			</View>
			) : (
				<Text>Biometrics is not supported</Text>
			)
		}

		{
			isRegistered && 
			<View>
				<Text>Registered successfully</Text>
				<View style={{ marginTop: 50 }}/>
				<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Login</Text>
				<TouchableOpacity style={styles.button} onPress={() => loginScreen()}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
			</View>
		}

		{
		isRegistered &&
			<View>
				{
					isAuthenticated ? (
						<Text>You may proceed</Text>
					) : (
						<Text>"If you enter the right login details now that'll be the end of it. I will not look for you, I will not pursue you, but if you don't, I will look for you, I will find you and I will kill you." - LN</Text>
					)
				}
			</View>
		}
	</View>
  )
}

const styles = StyleSheet.create({
	button: {
	  backgroundColor: 'orange', // Change this to your desired color
	  padding: 10,
	  borderRadius: 5,
	  marginTop: 10,
	},
	buttonText: {
	  color: '#FFFFFF',
	  textAlign: 'center',
	},
  });

export default Login
