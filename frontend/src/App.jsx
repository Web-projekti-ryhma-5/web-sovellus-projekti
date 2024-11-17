import React from 'react';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {

    return (
      <>
        <Header />
        <main style={{ padding: '2rem' }}>
          <Outlet />
        </main>
        <Footer />
      </>
    );
}