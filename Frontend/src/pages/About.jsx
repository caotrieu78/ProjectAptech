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
                        Giới thiệu về Maverick Dresses
                    </motion.h2>
                    <motion.p
                        className="lead text-white animate-text-wave mb-4"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        transition={{ delay: 0.2 }}
                    >
                        Maverick The Collection™, do C5coder (bao gồm 5 thành viên) sáng
                        lập, là thương hiệu thời trang đỉnh cao với sứ mệnh truyền cảm hứng
                        qua phong cách <strong>urban boho</strong>. Chúng tôi mang đến những
                        bộ đồng phục học sinh thời thượng, giúp các bạn trẻ tỏa sáng với cá
                        tính riêng.
                    </motion.p>
                    <motion.p
                        className="lead text-white animate-text-wave mb-4"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        transition={{ delay: 0.4 }}
                    >
                        Maverick không chỉ là thời trang, mà còn là cộng đồng{" "}
                        <strong>Mavies</strong> – những nữ doanh nhân đam mê sáng tạo và
                        thành công. Với 10-20 thiết kế mới ra mắt mỗi hai tuần, chúng tôi
                        luôn dẫn đầu xu hướng, mang đến sự mới mẻ và phong cách.
                    </motion.p>
                    <motion.p
                        className="lead text-white animate-text-wave mb-5"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        transition={{ delay: 0.6 }}
                    >
                        Tầm nhìn của chúng tôi là tạo nên phong trào (#bossbabes,
                        #entrepreneurs), nơi phụ nữ cùng nhau chinh phục tự do tài chính và
                        tự tin. Hãy gia nhập Maverick để hòa mình vào thế giới thời trang
                        đầy đam mê!
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
                        Khám phá Maverick ngay!
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
                        Bộ sưu tập đồng phục học sinh
                    </motion.h3>
                    <div className="row g-4">
                        {[
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/resdd842be9c6567ab71efc8f7b137d8ce7fr.jpg",
                                alt: "Đồng phục 1",
                                caption: "Phong cách hiện đại"
                            },
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/res744719668aab977e2b4a2b1a4e83d32bfr.jpg",
                                alt: "Đồng phục 2",
                                caption: "Năng động trẻ trung"
                            },
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/res2766b65f16dff5eac978ec51c0892d53fr.jpg",
                                alt: "Đồng phục 3",
                                caption: "Tinh tế thanh lịch"
                            },
                            {
                                src: "https://im.uniqlo.com/global-cms/spa/resa8e48da9dce2586571da18f8556f3506fr.jpg",
                                alt: "Đồng phục 4",
                                caption: "Sáng tạo cá tính"
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
