import React from 'react';
import '../assets/css/footer.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/owl.carousel.min.css';
import '../assets/css/slicknav.css';
import '../assets/css/flaticon.css';
import '../assets/css/animate.min.css';
import '../assets/css/magnific-popup.css';
import '../assets/css/fontawesome-all.min.css';
import '../assets/css/themify-icons.css';
import '../assets/css/slick.css';
import '../assets/css/nice-select.css';


const Footer = () => {
    return (
        <footer>
            <div className="footer-area footer-padding">
                <div className="container">
                    <div className="row d-flex justify-content-between">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                            <div className="single-footer-caption mb-50">
                                <div className="single-footer-caption mb-30">
                                    <div className="footer-logo mb-25">
                                        <a href="index.html"><img src="assets/img/logo/logo2_footer.png" alt=""/></a>
                                    </div>
                                    <div className="footer-tittle">
                                        <div className="footer-pera">
                                            <p>Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor elit. </p>
                                        </div>
                                    </div>
                                    <div className="footer-social">
                                        <a href="https://www.facebook.com/sai4ull"><i className="fab fa-facebook-square"></i></a>
                                        <a href="#"><i className="fab fa-twitter-square"></i></a>
                                        <a href="#"><i className="fab fa-linkedin"></i></a>
                                        <a href="#"><i className="fab fa-pinterest-square"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-4 col-sm-5">
                            <div className="single-footer-caption mb-50">
                                <div className="footer-tittle">
                                    <h4>Company</h4>
                                    <ul>
                                        <li><a href="index.html">Home</a></li>
                                        <li><a href="about.html">About Us</a></li>
                                        <li><a href="single-blog.html">Services</a></li>
                                        <li><a href="#">Cases</a></li>
                                        <li><a href="contact.html">Contact Us</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-7">
                            <div className="single-footer-caption mb-50">
                                <div className="footer-tittle">
                                    <h4>Services</h4>
                                    <ul>
                                        <li><a href="#">Commercial Cleaning</a></li>
                                        <li><a href="#">Office Cleaning</a></li>
                                        <li><a href="#">Building Cleaning</a></li>
                                        <li><a href="#">Floor Cleaning</a></li>
                                        <li><a href="#">Apartment Cleaning</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            <div className="single-footer-caption mb-50">
                                <div className="footer-tittle">
                                    <h4>Get in Touch</h4>
                                    <ul>
                                        <li><a href="#">152-515-6565</a></li>
                                        <li><a href="#">Demomail@gmail.com</a></li>
                                        <li><a href="#">New Orleans, USA</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom-area">
                <div className="container">
                    <div className="footer-border">
                        <div className="row d-flex align-items-center">
                            <div className="col-xl-12">
                                <div className="footer-copy-right text-center">
                                    <p>Copyright &copy;{new Date().getFullYear()} All rights reserved | This template is made with <i className="fa fa-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;