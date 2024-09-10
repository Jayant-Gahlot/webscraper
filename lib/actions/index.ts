"use server"
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreproduct(productURL: string){
    if(!productURL) return;

    try {
        connectToDB();
        const scrapedProduct = await scrapeAmazonProduct(productURL);

        if(!scrapedProduct) return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({url: scrapedProduct.url});

        if(existingProduct){
            const updatedpriceHistory: any =[
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice}
            ]

            product ={
                ...scrapedProduct,
                priceHistory: updatedpriceHistory,
                lowestPrice: getLowestPrice(updatedpriceHistory),
                highestPrice: getHighestPrice(updatedpriceHistory),
                averagePrice: getAveragePrice(updatedpriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            {url: scrapedProduct.url},
            product,
            {upsert: true, new:true}
        );

        revalidatePath(`/products/${newProduct._id}`)
    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export async function getProductById(productId: string){
    try {
        connectToDB();
        
        const product = await Product.findOne({_id: productId});

        if(!product) return null;

        return product;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts(){
    try {
        connectToDB();

        const products = await Product.find();
        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string){
    try {
        connectToDB();

        const currentProduct = await Product.findById(productId);

        if(!currentProduct) return null;

        const similarProducts = await Product.find({
            _id: {$ne: productId}
        }).limit(3);

        return similarProducts;
    } catch (error) {
        console.log(error);
    }
}