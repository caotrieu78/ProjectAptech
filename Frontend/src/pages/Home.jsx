import React from "react";
import SliderSection from "../components/SliderSection";
import ProductList from "./Product/ProductList";
import FlashSaleSection from "../components/FlashSaleSection";
import TrendingOutfitsSection from "../components/TrendingOutfitsSection";

const Home = () => {
    return (
        <div>
            <SliderSection />
            <ProductList />
            <FlashSaleSection />
            <TrendingOutfitsSection />
        </div>
    );
};

export default Home;
