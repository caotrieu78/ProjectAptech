import React from "react";
import SliderSection from "../components/SliderSection";
import ProductList from "./Product/ProductList";
import FlashSaleSection from "../components/FlashSaleSection";

const Home = () => {
    return (
        <div>
            <SliderSection />
            <ProductList />
            <FlashSaleSection />
        </div>
    );
};

export default Home;
