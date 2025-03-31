import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import LoginForm from './components/LoginForm';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/upload" element={<ImageUpload />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;