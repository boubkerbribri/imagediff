module.exports = {
    'BO': [
        {name: 'login', url: 'index.php?controller=AdminLogin'},
        {name: 'dashboard', url: 'index.php?controller=AdminLogin', customMethod: async function({page, loginInfos}) {
                await page.type('#email', loginInfos.admin.login);
                await page.type('#passwd', loginInfos.admin.password);
                await page.click('#submit_login');
                await page.waitForNavigation({waitUntil: 'networkidle0'});

                page.evaluate(async () => {
                    const block = document.querySelector("button.onboarding-button-shut-down");
                    if (block) {
                        await page.click('button.onboarding-button-shut-down');
                        await page.waitForSelector('a.onboarding-button-stop', {visible: true});
                        await page.click('a.onboarding-button-stop');
                    }
                });
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
        {name: 'discounts', url: 'index.php?controller=AdminCartRules'},
        {name: 'cart_rules', url: 'index.php?controller=AdminCartRules'},
        {name: 'add_cart_rule', url: 'index.php?controller=AdminCartRules&addcart_rule'},
        {name: 'catalog_price_rules', url: 'index.php?controller=AdminSpecificPriceRule'},
        {name: 'add_cart_rule', url: 'index.php?controller=AdminSpecificPriceRule&addspecific_price_rule'},
        {name: 'stock', url: 'index.php/sell/stocks/'},
        {name: 'movements', url: 'index.php/sell/stocks/movements'},
        {name: 'customers', url: 'index.php/sell/customers/'},
        {name: 'add_customer', url: 'index.php/sell/customers/new'},
        {name: 'addresses', url: 'index.php?controller=AdminAddresses'},
        {name: 'add_customer', url: 'index.php?controller=AdminAddresses&addaddress'},
        {name: 'customer_service', url: 'index.php?controller=AdminCustomerThreads'},
        {name: 'order_messages', url: 'index.php?controller=AdminOrderMessage'},
        {name: 'add_order_message', url: 'index.php?controller=AdminOrderMessage&addorder_message'},
        {name: 'merchandise_returns', url: 'index.php?controller=AdminReturn'},
        {name: 'stats', url: 'index.php?controller=AdminStats'},
        {name: 'module_manager', url: 'index.php/improve/modules/manage'},
        {name: 'module_manager', url: 'index.php/improve/modules/manage'},
        {name: 'module_manager_alerts', url: 'index.php/improve/modules/alerts'},
        {name: 'module_manager_updates', url: 'index.php/improve/modules/updates'},
        {name: 'module_catalog', url: 'index.php?controller=AdminPsMboModule'},
        {name: 'module_catalog_selection', url: 'index.php/improve/modules/addons-store'},
        {name: 'theme_logo', url: 'index.php/improve/design/themes/'},
        {name: 'add_theme', url: 'index.php/improve/design/themes/import'},
        {name: 'homepage_configuration', url: 'index.php?controller=AdminPsThemeCustoConfiguration'},
        {name: 'advanced_customization', url: 'index.php?controller=AdminPsThemeCustoAdvanced'},
        {name: 'theme_catalog', url: 'index.php?controller=AdminPsMboTheme'},
        {name: 'email_theme', url: 'index.php/improve/design/mail_theme/'},
        {name: 'pages', url: 'index.php/improve/design/cms-pages/'},
        {name: 'add_page_category', url: 'index.php/improve/design/cms-pages/category/new'},
        {name: 'add_page_category', url: 'index.php/improve/design/cms-pages/category/new'},
        {name: 'add_page', url: 'index.php/improve/design/cms-pages/new'},
        {name: 'positions', url: 'index.php/improve/design/modules/positions/'},
        {name: 'transplant_module', url: 'index.php?controller=AdminModulesPositions&addToHook='},
        {name: 'image_settings', url: 'index.php?controller=AdminImages'},
        {name: 'add_image_type', url: 'index.php?controller=AdminImages&addimage_type'},
        {name: 'link_widget', url: 'index.php/modules/link-widget/list'},
        {name: 'link_widget_new_block', url: 'index.php/modules/link-widget/create'},
        {name: 'carriers', url: 'index.php?controller=AdminCarriers'},
        {name: 'add_carrier', url: 'index.php?controller=AdminCarrierWizard'},
        {name: 'shipping_preferences', url: 'index.php/improve/shipping/preferences'},
        {name: 'payment_methods', url: 'index.php/improve/payment/payment_methods'},
        {name: 'payment_preferences', url: 'index.php/improve/payment/preferences'},
        {name: 'localization', url: 'index.php/improve/international/localization/'},
        {name: 'localization_languages', url: 'index.php/improve/international/languages/'},
        {name: 'add_localization_language', url: 'index.php/improve/international/languages/new'},
        {name: 'localization_currencies', url: 'index.php/improve/international/currencies/'},
        {name: 'add_localization_currency', url: 'index.php/improve/international/currencies/new'},
        {name: 'localization_geolocation', url: 'index.php/improve/international/geolocation/'},
        {name: 'locations_zones', url: 'index.php?controller=AdminZones'},
        {name: 'add_locations_zone', url: 'index.php?controller=AdminZones&addzone'},
        {name: 'locations_countries', url: 'index.php?controller=AdminCountries'},
        {name: 'add_locations_country', url: 'index.php?controller=AdminCountries&addcountry'},
        {name: 'locations_states', url: 'index.php?controller=AdminStates'},
        {name: 'add_locations_state', url: 'index.php?controller=AdminStates&addstate'},
        {name: 'taxes', url: 'index.php/improve/international/taxes/'},
        {name: 'add_tax', url: 'index.php/improve/international/taxes/new'},
        {name: 'tax_rules', url: 'index.php?controller=AdminTaxRulesGroup'},
        {name: 'add_tax_rule', url: 'index.php?controller=AdminTaxRulesGroup&addtax_rules_group'},
        {name: 'translations', url: 'index.php/improve/international/translations/settings'},
        {name: 'parameters_general', url: 'index.php/configure/shop/preferences/preferences'},
        {name: 'parameters_maintenance', url: 'index.php/configure/shop/maintenance/'},
        {name: 'orders_settings', url: 'index.php/configure/shop/order-preferences/'},
        {name: 'orders_statuses', url: 'index.php?controller=AdminStatuses'},
        {name: 'add_orders_status', url: 'index.php?controller=AdminStatuses&addorder_state'},
        {name: 'add_orders_return_status', url: 'index.php?controller=AdminStatuses&addorder_return_state'},
        {name: 'product_settings', url: 'index.php/configure/shop/product-preferences/'},
        {name: 'customer_settings', url: 'index.php/configure/shop/customer-preferences/'},
        {name: 'customer_settings_groups', url: 'index.php?controller=AdminGroups'},
        {name: 'add_customer_settings_group', url: 'index.php?controller=AdminGroups&addgroup'},
        {name: 'customer_settings_titles', url: 'index.php?controller=AdminGenders'},
        {name: 'add_customer_settings_title', url: 'index.php?controller=AdminGenders&addgender'},
        {name: 'contact', url: 'index.php/configure/shop/contacts/'},
        {name: 'add_contact', url: 'index.php/configure/shop/contacts/new'},
        {name: 'traffic_seo_urls', url: 'index.php/configure/shop/seo-urls/'},
        {name: 'add_page_traffic_seo_url', url: 'index.php/configure/shop/seo-urls/new'},
        {name: 'traffic_seo_search_engines', url: 'index.php?controller=AdminSearchEngines'},
        {name: 'add_traffic_seo_search_engine', url: 'index.php?controller=AdminSearchEngines&addsearch_engine'},
        {name: 'traffic_seo_referrers', url: 'index.php?controller=AdminReferrers'},
        {name: 'add_traffic_seo_referrer', url: 'index.php?controller=AdminReferrers&addreferrer'},
        {name: 'search', url: 'index.php?controller=AdminSearchConf'},
        {name: 'add_search_alias', url: 'index.php?controller=AdminSearchConf&addalias'},
        {name: 'search_tags', url: 'index.php?controller=AdminTags'},
        {name: 'add_search_tag', url: 'index.php?controller=AdminTags&addtag'},
        {name: 'merchant_expertise', url: 'index.php?controller=AdminGamification'},
        {name: 'information', url: 'index.php/configure/advanced/system-information/'},
        {name: 'performance', url: 'index.php/configure/advanced/performance/'},
        {name: 'administration', url: 'index.php/configure/advanced/administration/'},
        {name: 'emails', url: 'index.php/configure/advanced/emails/'},
        {name: 'import', url: 'index.php/configure/advanced/import/'},
        {name: 'employees', url: 'index.php/configure/advanced/employees/'},
        {name: 'add_employee', url: 'index.php/configure/advanced/employees/new'},
        {name: 'profiles', url: 'index.php/configure/advanced/profiles/'},
        {name: 'add_profile', url: 'index.php/configure/advanced/profiles/new'},
        {name: 'permissions', url: 'index.php?controller=AdminAccess'},
        {name: 'database', url: 'index.php/configure/advanced/sql-requests/'},
        {name: 'add_query', url: 'index.php/configure/advanced/sql-requests/new'},
        {name: 'logs', url: 'index.php/configure/advanced/logs/'},
        {name: 'webservice', url: 'index.php/configure/advanced/webservice-keys/'},
        {name: 'add_webservice_key', url: 'index.php/configure/advanced/webservice-keys/new'},
    ],
    'FO': [
        {name: 'homepage', url:'index.php'},
        {name: 'login', url:'index.php?controller=authentication&back=my-account'},
        {name: 'my_account', url:'index.php?controller=authentication&back=my-account', customMethod: async function({page, loginInfos}) {
                await page.type('#login-form input[name=email]', loginInfos.user.login);
                await page.type('#login-form input[name=password]', loginInfos.user.password);
                await page.click('#submit-login');
            }},
        {name: 'product_1', url: 'index.php?id_product=1&id_product_attribute=1&rewrite=hummingbird-printed-t-shirt&controller=product&id_lang=1#/1-size-s/8-color-white'},
        {name: 'category_clothes', url: 'index.php?id_category=3&controller=category&id_lang=1'},
        {name: 'contact_us', url: 'index.php?controller=contact'},
        {name: 'prices_drop', url: 'index.php?controller=prices-drop'},
        {name: 'new_products', url: 'index.php?controller=new-products'},
        {name: 'best_sales', url: 'index.php?controller=best-sales'},
        {name: 'search_mug', url: 'index.php?controller=search&s=mug'},
        {name: 'cms_delivery', url: 'index.php?id_cms=1&controller=cms&id_lang=1'},
        {name: 'account_informations', url: 'index.php?controller=identity'},
        {name: 'account_addresses', url: 'index.php?controller=addresses'},
        {name: 'account_history', url: 'index.php?controller=history'},
        {name: 'account_credit_slips', url: 'index.php?controller=order-slip'},
        {name: 'account_gdpr', url: 'index.php?fc=module&module=psgdpr&controller=gdpr&id_lang=1'},
    ]
};
