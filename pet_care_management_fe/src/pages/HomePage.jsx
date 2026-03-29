import Header from '../components/home/Header'
import React, { useEffect } from 'react';
import Slider from '../components/home/Slider';
import Services from '../components/home/Services';
import PetCare from '../components/home/PetCare';
import Footer from '../components/home/Footer';
import AdoptUs from '../components/home/AdoptUs';

const HomePage = () => {
    useEffect(() => {
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    return (
        <div style={{ overflowX: 'hidden' }}>
            <Header />
            <Slider />
            <Services />
            <AdoptUs />
            <PetCare />
            <Footer />
        </div>
    );
};

export default HomePage;
