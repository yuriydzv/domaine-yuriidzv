class ProductCard extends HTMLElement {
  constructor() {
    super();

    this.productData = this._parseJSONAttr("data-product-json");
    this.variantsData = this._parseJSONAttr("data-product-variants-json");

    this.variantGroups = this.querySelectorAll('.swatch-group');

    this.variantGroups.forEach((group) => {
      const inputs = group.querySelectorAll('input.swatch-input__input');
      this._attachVariantListeners(inputs);
    });

    const selected = this.querySelector('input.swatch-input__input:checked');
    if (selected) {
      this._updateVariantContent(
        parseInt(selected.dataset.variantId || selected.id)
      );
    }
  }

  _parseJSONAttr(attr) {
    const raw = this.getAttribute(attr);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error(`Invalid JSON in ${attr}`, e);
      return null;
    }
  }

  _attachVariantListeners(inputs) {
    inputs.forEach((input) => {
      input.addEventListener("change", (event) => {
        const selectedInput = event.currentTarget;
        const inputName = selectedInput.name;
        const inputValue = selectedInput.value;

        inputs.forEach((i) => {
          i.checked = false;
          this._updateSwatchAria(i, false);
        });

        inputs.forEach((i) => {
          if (i.value === inputValue) {
            i.checked = true;
            this._updateSwatchAria(i, true);
          }
        });

        const selectedVariantId = parseInt(
          selectedInput.dataset.variantId || selectedInput.id
        );
        this._updateVariantContent(selectedVariantId);
      });
    });
  }

  _updateSwatchAria(input, isSelected) {
    const label = this._getLabelForInput(input);
    if (label) {
      label.setAttribute("aria-checked", String(isSelected));
    }
  }

  _getLabelForInput(input) {
    return input.closest("div")?.querySelector(`label[for="${input.id}"]`);
  }

  _updateVariantContent(variantId) {
    const variant = this.variantsData.find((v) => v.id == variantId);
    if (!variant) return;

    this._updatePrice(variant);
    this._updateBadges(variant);
    this._updateImages(variant);
  }

  _updatePrice(variant) {
    const priceWrapper = this.querySelector("#price");
    if (!priceWrapper) return;

    const compareEl = this.querySelector("#compare-price");
    const regularEl = this.querySelector("#regular-price");

    const isOnSale =
      variant.compare_at_price && variant.compare_at_price > variant.price;
    const isSoldOut = !variant.available;

    if (compareEl) {
      compareEl.textContent = this._formatMoney(variant.compare_at_price);
      compareEl.classList.toggle("hidden", !isOnSale);
      compareEl.classList.toggle("opacity-50", isSoldOut);
    }

    if (regularEl) {
      regularEl.textContent = this._formatMoney(variant.price);
      regularEl.classList.toggle("text-regal-red", isOnSale);
      regularEl.classList.toggle("opacity-50", isSoldOut);
    }
  }

  _formatMoney(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.productData?.currency || "USD",
    }).format(cents / 100);
  }

  _updateBadges(variant) {
    const onSale =
      variant.compare_at_price && variant.compare_at_price > variant.price;
    const soldOut = !variant.available;

    const saleBadge = this.querySelector("#sale-badge");
    if (saleBadge) saleBadge.classList.toggle("hidden", !onSale || soldOut);

    const soldOutBadge = this.querySelector("#sold-out-badge");
    if (soldOutBadge)
      soldOutBadge.classList.toggle("hidden", variant.available);
  }

  _updateImages(variant) {
    const mainImage = variant.featured_image;
    const hoverKey = (variant.title || "").toLowerCase() + "-secondary";

    const hoverImage = this.productData?.media?.find(
      (media) =>
        media.media_type === "image" &&
        media.preview_image?.src?.includes(hoverKey)
    )?.preview_image;

    ["main", "hover"].forEach((type, i) => {
      const imgEl = this.querySelector(`picture [data-image-type="${type}"]`);
      const picture = imgEl?.closest("picture");
      const source = picture?.querySelector("source");

      const imgData = i === 0 ? mainImage : hoverImage;

      if (imgData && imgEl && picture) {
        imgEl.src = imgData.src;
        imgEl.alt = variant.public_title || this.productData.title || "";
        imgEl.width = imgData.width || 630;
        imgEl.height = imgData.height || 630;
        picture.classList.remove("hidden");

        if (source && imgData.src) {
          source.srcset = imgData.src.replace(/\.(jpg|jpeg|png)$/, ".webp");
        }
      } else if (picture) {
        picture.classList.add("hidden");
      }
    });
  }
}

customElements.define("product-card", ProductCard);
