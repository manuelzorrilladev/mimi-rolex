import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';


class AuthService {
  async login(user) {
    const response = await axios.post(API_URL + 'signin', {
      username: user.username,
      password: user.password
    });
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      age:user.age,
      email: user.email,
      phone: user.phone,
      password: user.password
    });
  }
}

export default new AuthService();