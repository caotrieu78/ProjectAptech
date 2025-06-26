import React from "react";
import { motion } from "framer-motion";

const About = () => {
    const textVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.7 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.15,
            boxShadow:
                "0 0 30px rgba(96, 165, 250, 1), 0 0 50px rgba(59, 130, 246, 0.6)",
            transition: { duration: 0.4, yoyo: Infinity }
        },
        tap: { scale: 0.9 }
    };

    return (
        <div className="min-vh-100 bg-wave-gradient text-white d-flex flex-column">
            {/* About Content */}
            <main className="container my-5 py-5 flex-grow">
                <section className="about-content text-center">
                    <motion.h2
                        className="display-4 font-artistic mb-5"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                    >
                        About Maverick Dresses
                    </motion.h2>
                    <motion.p
                        className="lead text-white animate-text-wave mb-4"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        transition={{ delay: 0.2 }}
                    >
                        Maverick The Collection™, founded by C5coder (a team of five
                        members), is a premier fashion brand with a mission to inspire
                        through <strong>urban boho</strong> style. We offer trendy school
                        uniforms that empower young individuals to shine with their unique
                        personality.
                    </motion.p>
                    <motion.p
                        className="lead text-white animate-text-wave mb-4"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        transition={{ delay: 0.4 }}
                    >
                        Maverick is more than just fashion; it’s a community of{" "}
                        <strong>Mavies</strong> – passionate women entrepreneurs who embrace
                        creativity and success. With 10-20 new designs launched every two
                        weeks, we stay ahead of trends, delivering freshness and style.
                    </motion.p>
                    <motion.p
                        className="lead text-white animate-text-wave mb-5"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        transition={{ delay: 0.6 }}
                    >
                        Our vision is to create a movement (#bossbabes, #entrepreneurs)
                        where women unite to conquer financial freedom and confidence. Join
                        Maverick to immerse yourself in a world of passionate fashion!
                    </motion.p>
                    <motion.a
                        href="https://www.maverickthecollection.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn animate-button-glow text-white px-5 py-3 rounded-pill fw-bold fs-5"
                        style={{
                            background: "linear-gradient(to right, #3B82F6, #1E40AF)"
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        transition={{ delay: 0.8 }}
                    >
                        Explore Maverick Now!
                    </motion.a>
                </section>

                {/* Image Gallery */}
                <section className="gallery mt-5">
                    <motion.h3
                        className="h2 font-artistic text-center mb-5"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                    >
                        School Uniform Collection
                    </motion.h3>
                    <div className="row g-4">
                        {[
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/resdd842be9c6567ab71efc8f7b137d8ce7fr.jpg",
                                alt: "Uniform 1",
                                caption: "Modern Style"
                            },
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/res744719668aab977e2b4a2b1a4e83d32bfr.jpg",
                                alt: "Uniform 2",
                                caption: "Youthful Energy"
                            },
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/res2766b65f16dff5eac978ec51c0892d53fr.jpg",
                                alt: "Uniform 3",
                                caption: "Elegant Sophistication"
                            },
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/resa8e48da9dce2586571da18f8556f3506fr.jpg",
                                alt: "Uniform 4",
                                caption: "Creative Individuality"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="col-12 col-sm-6 col-lg-3 gallery-item"
                                initial="hidden"
                                animate="visible"
                                variants={imageVariants}
                                transition={{ delay: 0.2 * index }}
                            >
                                <div className="position-relative overflow-hidden rounded-3 shadow-lg">
                                    <img src={item.src} alt={item.alt} className="gallery-img" />
                                    <div className="gallery-overlay">
                                        <p className="text-white fs-5 fw-semibold gallery-caption">
                                            {item.caption}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;
