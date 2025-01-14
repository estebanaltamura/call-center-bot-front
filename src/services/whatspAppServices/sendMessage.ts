import axios from 'axios';

const BASE_URL = 'http://localhost:80'; // Cambia esto a tu dominio o IP

export const sendMessage = async (to: string, message: string): Promise<void> => {
  try {
    console.log(`${BASE_URL}/send-message`);
    const response = await axios.post(`${BASE_URL}/send-message`, { to, message });
    console.log(response.data);
  } catch (error: any) {
    console.error('Error enviando mensaje:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Error desconocido');
  }
};
