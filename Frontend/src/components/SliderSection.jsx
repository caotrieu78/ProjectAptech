import React from "react";
import { Carousel, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
        title: "Awesome Collection for Girls",
        subtitle: "New School Year Fun!"
    },
    {
        image:
            "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Cool Gear for Boys",
        subtitle: "Cool Jackets & Coats"
    },
    {
        image:
            "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "New Items for Kids",
        subtitle: "Explore Now!"
    }
];

// Using Bootstrap default buttons
const SliderSection = () => {
    return (
        <>
            <style>
                {`
          /* Slider Section */
          .slider-section {
            width: 100%;
            height: 550px;
            overflow: hidden;
            margin: 0;
            padding: 0;
            position: relative;
          }

          /* Carousel Slide */
          .carousel-slide {
            width: 100%;
            height: 550px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
          }

          /* Overlay for better text readability */
          .carousel-slide::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1;
          }

          /* Ensure content is above overlay */
          .carousel-slide .container {
            position: relative;
            z-index: 2;
          }

          /* Custom text styling */
          .display-6,
          .display-2 {
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
          }

          /* Adjust Bootstrap control buttons */
          .carousel-control-prev,
          .carousel-control-next {
            opacity: 0.8;
          }

          .carousel-control-prev:hover,
          .carousel-control-next:hover {
            opacity: 1;
          }
        `}
            </style>
            <section className="slider-section">
                <Carousel
                    fade
                    controls
                    indicators
                    prevIcon={<span className="carousel-control-prev-icon" />}
                    nextIcon={<span className="carousel-control-next-icon" />}
                >
                    {slides.map((slide, idx) => (
                        <Carousel.Item key={idx} interval={5000}>
                            <div
                                className="carousel-slide d-flex align-items-center"
                                style={{
                                    backgroundImage: `url(${slide.image})`
                                }}
                            >
                                <Container className="text-start">
                                    <h4 className="display-6 fw-normal text-white mb-2">
                                        {slide.title}
                                    </h4>
                                    <h2 className="display-2 fw-bold text-white mb-4">
                                        {slide.subtitle}
                                    </h2>
                                    <Button
                                        href="/product"
                                        variant="light"
                                        size="lg"
                                        className="fw-bold px-4"
                                    >
                                        Try it out!
                                    </Button>
                                </Container>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </section>
        </>
    );
};

export default SliderSection;
