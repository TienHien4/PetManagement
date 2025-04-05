import React from 'react';
import Footer from '../components/home/Footer';
import PetRegistrationForm from '../components/services/PetRegistrationForm';
import Header from '../components/home/Header';

const ServicesPage = () => {
    return (
        <div>
        <Header></Header>
        <PetRegistrationForm></PetRegistrationForm>
        <Footer></Footer>
        </div>
    );
};

export default ServicesPage;