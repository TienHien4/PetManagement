import Header from '../components/home/Header'
import React from 'react';
import Slider from '../components/home/Slider';
import Services from '../components/home/Services';
import PetCare from '../components/home/PetCare';
import Footer from '../components/home/Footer';
import AdoptUs from '../components/home/AdoptUs';

const HomePage = () => {
    return (
        <div>
            <Header></Header>
            <Slider></Slider>
            <Services></Services>
            <AdoptUs></AdoptUs>
            <PetCare></PetCare>
            <Footer></Footer>
        </div>

    );
};

export default HomePage;