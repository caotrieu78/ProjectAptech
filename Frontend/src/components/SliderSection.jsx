import React from 'react';
import { Carousel, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const slides = [
    {
        image: 'https://marketplace.canva.com/MADFI8h1Ivw/1/thumbnail_large/canva-white-silk---background-MADFI8h1Ivw.jpg',
        title: 'Women Collection 2018',
        subtitle: 'NEW SEASON',
    },
    {
        image: 'https://marketplace.canva.com/MADFI8h1Ivw/1/thumbnail_large/canva-white-silk---background-MADFI8h1Ivw.jpg',
        title: 'Men New-Season',
        subtitle: 'Jackets & Coats',
    },
    {
        image: 'https://marketplace.canva.com/MADFI8h1Ivw/1/thumbnail_large/canva-white-silk---background-MADFI8h1Ivw.jpg',
        title: 'Men Collection 2018',
        subtitle: 'New arrivals',
    }
];

// Triangle button styles
const triangleLeft = (
    <span style={{
        display: 'inline-block',
        width: 0,
        height: 0,
        borderTop: '15px solid transparent',
        borderBottom: '15px solid transparent',
        borderRight: '15px solid #aaa',
    }} />
);

const triangleRight = (
    <span style={{
        display: 'inline-block',
        width: 0,
        height: 0,
        borderTop: '15px solid transparent',
        borderBottom: '15px solid transparent',
        borderLeft: '15px solid #aaa',
    }} />
);

const SliderSection = () => {
    return (
        <section
            className="position-relative"
            style={{
                width: '100%',
                height: '550px',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
            }}
        >
            <Carousel
                fade
                controls
                indicators
                prevIcon={
                    <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: '30px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                    }}>
                        {triangleLeft}
                    </span>
                }
                nextIcon={
                    <span style={{
                        position: 'absolute',
                        top: '50%',
                        right: '30px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                    }}>
                        {triangleRight}
                    </span>
                }
            >
                {slides.map((slide, idx) => (
                    <Carousel.Item key={idx} interval={5000}>
                        <div
                            className="d-flex align-items-center"
                            style={{
                                width: '100vw',
                                height: '100vh',
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <Container className="text-start">
                                <h4 className="display-6 fw-normal text-dark mb-2">{slide.title}</h4>
                                <h2 className="display-2 fw-bold text-dark mb-4">{slide.subtitle}</h2>
                                <Button href="/product" variant="dark" size="lg" className="fw-bold px-4">
                                    Shop Now
                                </Button>
                            </Container>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </section>
    );
};

export default SliderSection;
