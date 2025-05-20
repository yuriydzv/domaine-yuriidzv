import Swiper, { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const FeaturedProducts = {
  onLoad() {
    this.sliderWrapper = this.container.querySelector(".swiper");
    if (!this.sliderWrapper) return;

    this.media = window.matchMedia("(min-width: 767px)");
    this.media.addEventListener("change", () => this._handleMediaChange());

    this._handleMediaChange();
  },

  _handleMediaChange() {
    if (this.media.matches) {
      this._destroySwiper();
    } else {
      this._initSwiper();
    }
  },

  _initSwiper() {
    if (this.slider) return;

    this.slider = new Swiper(this.sliderWrapper, {
      modules: [Pagination],
      spaceBetween: 20,
      pagination: {
        el: this.sliderWrapper.querySelector('.swiper-pagination'),
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1.25,
        },
        480: {
          slidesPerView: 1.5,
        },
        640: {
          slidesPerView: 2,
        }
      }
    });
  },

  _destroySwiper() {
    if (this.slider) {
      this.slider.destroy(true, true);
      this.slider = null;
    }
  },
};

export default FeaturedProducts;
