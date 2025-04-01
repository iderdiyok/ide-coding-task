import products from '../data/objects.json';
import users from '../data/users.json';
import type { LoginCredentials, Product } from '../types';

const DELAY = 5000;

export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Array.isArray(products) ? products : []);
    }, DELAY);
  });
};

export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.users.find(
        (u) => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        resolve({ success: true, message: 'Login successful!' });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 1000);
  });
};