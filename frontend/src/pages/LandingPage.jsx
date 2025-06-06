import { useEffect, useState } from 'react';
import LandingHeader from '../components/Landing/LandingHeader';
import Hero from '../components/Landing/Hero';
import About from './../components/Landing/About';
import Services from '../components/Landing/Services';
import Footer from '../components/Landing/Footer';
import { IoMdArrowDropup } from "react-icons/io";
import { motion } from 'framer-motion';

const LandingPage = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => [
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    ]

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen">
            <LandingHeader />
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={sectionVariants}
            >

                <Hero />
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={sectionVariants}
            >

                <About />
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={sectionVariants}
            >

                <Services />
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={sectionVariants}
            >

                <Footer />
            </motion.div>
            <a
                href="#scrolltop"
                id="scrolltop"
                className={`scrolltop ${showScrollTop ? 'scrolltop--show' : ''} cursor-pointer`}
                onClick={handleScrollToTop}
            >
                <IoMdArrowDropup />
            </a>
        </div>
    );
};

export default LandingPage;
