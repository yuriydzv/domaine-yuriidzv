import { register, load } from "@shopify/theme-sections";
import FeaturedProducts from "./featured-products";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  once: true,
  duration: 600,
  easing: "ease-out-cubic",
});

register("featured-products", FeaturedProducts);
load("*");
