// Image assets mapping for Uncle's Chinese Restaurant
import heroImg from '../assets/images/hero_uncles_chinese_spread_1790412044835.jpg';
import manchowSoupImg from '../assets/images/food_manchow_soup_1790412058706.jpg';
import paneerChillyImg from '../assets/images/food_paneer_chilly_1790412072740.jpg';
import schezwanNoodlesImg from '../assets/images/food_schezwan_noodles_1790412088668.jpg';
import chickenLollipopImg from '../assets/images/food_chicken_lollipop_1790412105196.jpg';
import vegFriedRiceImg from '../assets/images/veg_fried_rice_1790511503684.jpg';
import vegManchurianImg from '../assets/images/veg_manchurian_1790511515117.jpg';
import chilliChickenImg from '../assets/images/chilli_chicken_1790511525956.jpg';
import chineseBhelImg from '../assets/images/chinese_bhel_1790511538902.jpg';
import eggNoodlesImg from '../assets/images/egg_noodles_1790511552954.jpg';

export const ASSET_IMAGES = {
  hero: heroImg,
  manchowSoup: manchowSoupImg,
  paneerChilly: paneerChillyImg,
  schezwanNoodles: schezwanNoodlesImg,
  chickenLollipop: chickenLollipopImg,
  vegFriedRice: vegFriedRiceImg,
  vegManchurian: vegManchurianImg,
  chilliChicken: chilliChickenImg,
  chineseBhel: chineseBhelImg,
  eggNoodles: eggNoodlesImg,
};

/**
 * Returns a high-fidelity culinary photo precisely matched according to the dish name,
 * preparation style, category, and dietary type.
 */
export function getFoodImage(category: string, name: string, diet: 'veg' | 'non-veg' | 'egg'): string {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  // 1. Chicken Lollipops (Oil Fry, Dry, Gravy)
  if (lowerName.includes('lollipop')) {
    return ASSET_IMAGES.chickenLollipop;
  }

  // 2. Crispy Chinese Bhel & Chopsuey (crispy fried noodles tossed in red sauce)
  if (lowerName.includes('bhel') || lowerName.includes('chopsuey')) {
    return ASSET_IMAGES.chineseBhel;
  }

  // 3. Paneer specialties (Paneer Chilly, Paneer Crispy, Paneer 65, Paneer Soup, Paneer Rice)
  if (lowerName.includes('paneer')) {
    return ASSET_IMAGES.paneerChilly;
  }

  // 4. Non-Veg Starters & Chilli Chicken (Chicken Chilly, Chicken 65, Chicken Crispy, Chicken Manchurian)
  if (
    diet === 'non-veg' &&
    (lowerCat.includes('starter') ||
      lowerName.includes('chilly') ||
      lowerName.includes('crispy') ||
      lowerName.includes('65') ||
      lowerName.includes('manchurian'))
  ) {
    return ASSET_IMAGES.chilliChicken;
  }

  // 5. Veg Manchurian, Veg Crispy, Veg 65, Veg Schezwan Starters
  if (
    diet === 'veg' &&
    (lowerName.includes('manchurian') ||
      lowerName.includes('crispy') ||
      lowerName.includes('65') ||
      (lowerCat.includes('starter') && lowerName.includes('schezwan')))
  ) {
    return ASSET_IMAGES.vegManchurian;
  }

  // 6. All Soups (Manchow, Clear, Hot & Sour, Noodles Soup, Royal Soup, Garlic, Ginger, etc.)
  if (lowerCat.includes('soup') || lowerName.includes('soup')) {
    return ASSET_IMAGES.manchowSoup;
  }

  // 7. Egg dishes (Egg Hakka Noodles, Egg Schezwan Noodles, Egg Fried Rice, Chowmein Egg)
  if (diet === 'egg' || lowerCat.includes('egg') || lowerName.includes('egg')) {
    return ASSET_IMAGES.eggNoodles;
  }

  // 8. Rice dishes:
  // - Triple Schezwan, Combination, Chopper, and Chicken Rice feasts -> Grand Spread Hero image
  if (
    lowerName.includes('triple') ||
    lowerName.includes('combination') ||
    lowerName.includes('chopper') ||
    (diet === 'non-veg' && lowerCat.includes('rice'))
  ) {
    return ASSET_IMAGES.hero;
  }

  // - Veg Fried Rice, Singapore Veg Rice, Hongkong Veg Rice, Garlic Fried Rice, Chilly Veg Rice
  if (lowerCat.includes('rice') || lowerName.includes('rice')) {
    return ASSET_IMAGES.vegFriedRice;
  }

  // 9. Noodles & Chowmein (Veg Hakka Noodles, Schezwan Noodles, Chilly Garlic Noodles, Chicken Noodles)
  if (lowerCat.includes('noodles') || lowerName.includes('noodles') || lowerName.includes('chowmein')) {
    return ASSET_IMAGES.schezwanNoodles;
  }

  // 10. Fallbacks based on dietary identity
  if (diet === 'non-veg') {
    return ASSET_IMAGES.chilliChicken;
  }

  return ASSET_IMAGES.vegManchurian;
}
