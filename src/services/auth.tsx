import api from './api';

export const register = async (data: any) =>
{
	const response = await api.post('/api/register_bm/', data);

	return response.data;
};

export const login = async (data: any) =>
{
	try 
	{
		const response = await api.post('/api/login_bm/', data);

		return response.data;
	}
	catch(error)
	{
		return {"message": "Invalid Credentials"};
	};

};

export const logOut = async (token: string) =>
{
	const response = await api.get('/api/logout/', { headers: { Authorization: `Bearer ${token}` }});

	return response.data;
};