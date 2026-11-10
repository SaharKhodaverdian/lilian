import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';
export default defineConfig({base:'./',plugins:[{name:'component-images',closeBundle(){mkdirSync('dist/src',{recursive:true});cpSync('src/images','dist/src/images',{recursive:true});}}],build:{rollupOptions:{input:["cart.html","checkout.html","index.html","order-result.html","payment.html","shop-page-I.html","shop-page-II.html","women-category.html"]}}});
