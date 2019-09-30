module.exports = {
    'BO': [
        {name: 'dashboard', url:'index.php?controller=AdminDashboard', customMethod: function({page}) {
                page.evaluate(() => {
                    const block = document.querySelector('#premium_advice_container');
                    if (block) block.remove();
                });
                page.evaluate(() => {
                    const block = document.querySelector("[id*='wrap_id_advice']");
                    if (block) block.remove();
                });
            }},
        {name: 'orders', url: 'index.php?controller=AdminOrders'},
        {name: 'add_orders', url: 'index.php?controller=AdminOrders&addorder'},
        {name: 'invoices', url: 'index.php/sell/orders/invoices/'},
        {name: 'credits_slips', url: 'index.php?controller=AdminSlip'},
        {name: 'delivery_slips', url: 'index.php/sell/orders/delivery-slips/'},
        {name: 'shopping_carts', url: 'index.php?controller=AdminCarts'},
        {name: 'products', url: 'index.php/sell/catalog/products'},
        {name: 'categories', url: 'index.php/sell/catalog/categories', customMethod: function({page}) {
                page.evaluate(() => {
                    const block = document.querySelector('#categoriesShowcaseCard');
                    if (block) block.remove();
                });
            }},
        {name: 'add_category', url: 'index.php/sell/catalog/categories/new'},
        {name: 'monitoring', url: 'index.php?controller=AdminTracking'},
        {name: 'attributes', url: 'index.php?controller=AdminAttributesGroups'},
        {name: 'add_attribute', url: 'index.php?controller=AdminAttributesGroups&addattribute_group'},
        {name: 'add_attribute_value', url: 'index.php?controller=AdminAttributesGroups&updateattribute'},
        {name: 'features', url: 'index.php?controller=AdminFeatures'},
        {name: 'add_feature', url: 'index.php?controller=AdminFeatures&addfeature'},
        {name: 'add_feature_value', url: 'index.php?controller=AdminFeatures&addfeature_value'},
        {name: 'brands', url: 'index.php/sell/catalog/brands/'},
        {name: 'add_brand', url: 'index.php/sell/catalog/brands/new'},
        {name: 'add_brand_address', url: 'index.php/sell/catalog/brands/addresses/new'},
        {name: 'suppliers', url: 'index.php?controller=AdminSuppliers'},
        {name: 'add_supplier', url: 'index.php?controller=AdminSuppliers&addsupplier'},
        {name: 'files', url: 'index.php?controller=AdminAttachments'},
        {name: 'add_file', url: 'index.php?controller=AdminAttachments&addattachment'},
    ],
    'FO': [
        {name: 'homepage', url:'index.php'},
        {name: 'product_1', url: 'index.php?id_product=1&id_product_attribute=1&rewrite=hummingbird-printed-t-shirt&controller=product&id_lang=1#/1-size-s/8-color-white'},
        {name: 'category_clothes', url: 'index.php?id_category=3&controller=category&id_lang=1'},
    ]
};
