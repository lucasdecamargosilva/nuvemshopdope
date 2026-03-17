<div id="single-product" class="js-has-new-shipping js-product-detail js-product-container js-shipping-calculator-container" data-variants="{{product.variants_object | json_encode }}" data-store="product-detail">
    <div class="container-fluid p-0">
        <div class="row no-gutters">
            <div class="col-md-auto product-image-column right-line-md bottom-line bottom-no-line-md">
                {% include 'snipplets/product/product-image.tpl' %}
            </div>
            <div class="col-md-auto product-info-column" data-store="product-info-{{ product.id }}">
                {% if settings.product_image_format != 'slider' %}
                    <div class="js-sticky-product sticky-product transition-soft mb-neg-1">
                {% endif %}
                        {% include 'snipplets/product/product-form.tpl' %}
                        {% if not settings.full_width_description %}
                            {% include 'snipplets/product/product-description.tpl' %}
                        {% endif %}
                {% if settings.product_image_format != 'slider' %}
                    </div>
                {% endif %}
            </div>
        </div>
    </div>

    {# Product description full width #}

    {% if settings.full_width_description %}
        {% if settings.full_width_description %}
            {% include 'snipplets/product/product-description.tpl' %}
        {% endif %}
    {% endif %}
</div>

{# Related products #}
{% include 'snipplets/product/product-related.tpl' %}
