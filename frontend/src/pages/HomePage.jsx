import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieList from '../components/MovieList';
import './HomePage.css';

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
      <>
        <Header onSearch={setSearchTerm} />
        <main style={{ padding: '2rem' }}>
          <MovieList searchTerm={searchTerm} />
        </main>
        <Footer />
      </>
    );
}
