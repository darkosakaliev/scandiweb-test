-- Create database tables
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    description TEXT,
    brand VARCHAR(100),
    gallery TEXT,
    category_id VARCHAR(50),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS attributes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    product_id VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS attribute_values (
    id VARCHAR(50) PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    display_value VARCHAR(255) NOT NULL,
    attribute_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (attribute_id) REFERENCES attributes (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    currency_label VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(5) DEFAULT '$',
    product_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Insert categories
INSERT INTO
    categories (id, name)
VALUES
    ('c1', 'all'),
    ('c2', 'clothes'),
    ('c3', 'tech');

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_details JSON NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert products
INSERT INTO
    products (
        id,
        name,
        in_stock,
        description,
        brand,
        gallery,
        category_id
    )
VALUES
    (
        'huarache-x-stussy-le',
        'Nike Air Huarache Le',
        TRUE,
        '<p>Great sneakers for everyday use!</p>',
        'Nike x Stussy',
        JSON_ARRAY (
            'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_2_720x.jpg?v=1612816087',
            'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_1_720x.jpg?v=1612816087',
            'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_3_720x.jpg?v=1612816087',
            'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_5_720x.jpg?v=1612816087',
            'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_4_720x.jpg?v=1612816087'
        ),
        'c2'
    ),
    (
        'jacket-canada-goosee',
        'Jacket',
        TRUE,
        '<p>Awesome winter jacket</p>',
        'Canada Goose',
        JSON_ARRAY (
            'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016105/product-image/2409L_61.jpg',
            'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016107/product-image/2409L_61_a.jpg',
            'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016108/product-image/2409L_61_b.jpg',
            'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016109/product-image/2409L_61_c.jpg',
            'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016110/product-image/2409L_61_d.jpg',
            'https://images.canadagoose.com/image/upload/w_1333,c_scale,f_auto,q_auto:best/v1634058169/product-image/2409L_61_o.png',
            'https://images.canadagoose.com/image/upload/w_1333,c_scale,f_auto,q_auto:best/v1634058159/product-image/2409L_61_p.png'
        ),
        'c2'
    ),
    (
        'playstation-5',
        'PlayStation 5',
        TRUE,
        '<p>A good gaming console. Plays games of PS4! Enjoy if you can buy it mwahahahaha</p>',
        'Sony',
        JSON_ARRAY (
            'https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/610%2B69ZsKCL._SL1500_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/51iPoFwQT3L._SL1230_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/61qbqFcvoNL._SL1500_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/51HCjA3rqYL._SL1230_.jpg'
        ),
        'c3'
    ),
    (
        'xbox-series-s',
        'Xbox Series S 512GB',
        FALSE,
        '\n<div>\n    <ul>\n        <li><span>Hardware-beschleunigtes Raytracing macht dein Spiel noch realistischer</span></li>\n        <li><span>Spiele Games mit bis zu 120 Bilder pro Sekunde</span></li>\n        <li><span>Minimiere Ladezeiten mit einer speziell entwickelten 512GB NVMe SSD und wechsle mit Quick Resume nahtlos zwischen mehreren Spielen.</span></li>\n        <li><span>Xbox Smart Delivery stellt sicher, dass du die beste Version deines Spiels spielst, egal, auf welcher Konsole du spielst</span></li>\n        <li><span>Spiele deine Xbox One-Spiele auf deiner Xbox Series S weiter. Deine Fortschritte, Erfolge und Freundesliste werden automatisch auf das neue System übertragen.</span></li>\n        <li><span>Erwecke deine Spiele und Filme mit innovativem 3D Raumklang zum Leben</span></li>\n        <li><span>Der brandneue Xbox Wireless Controller zeichnet sich durch höchste Präzision, eine neue Share-Taste und verbesserte Ergonomie aus</span></li>\n        <li><span>Ultra-niedrige Latenz verbessert die Reaktionszeit von Controller zum Fernseher</span></li>\n        <li><span>Verwende dein Xbox One-Gaming-Zubehör -einschließlich Controller, Headsets und mehr</span></li>\n        <li><span>Erweitere deinen Speicher mit der Seagate 1 TB-Erweiterungskarte für Xbox Series X (separat erhältlich) und streame 4K-Videos von Disney+, Netflix, Amazon, Microsoft Movies &amp; TV und mehr</span></li>\n    </ul>\n</div>',
        'Microsoft',
        JSON_ARRAY (
            'https://images-na.ssl-images-amazon.com/images/I/71vPCX0bS-L._SL1500_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/71q7JTbRTpL._SL1500_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/71iQ4HGHtsL._SL1500_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/61IYrCrBzxL._SL1500_.jpg',
            'https://images-na.ssl-images-amazon.com/images/I/61RnXmpAmIL._SL1500_.jpg'
        ),
        'c3'
    ),
    (
        'imac-2021',
        'iMac 2021',
        TRUE,
        'The new iMac!',
        'Apple',
        JSON_ARRAY (
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202104?wid=904&hei=840&fmt=jpeg&qlt=80&.v=1617492405000'
        ),
        'c3'
    ),
    (
        'iphone-12-pro',
        'iPhone 12 Pro',
        TRUE,
        'This is iPhone 12. Nothing else to say.',
        'Apple',
        JSON_ARRAY (
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&amp;hei=1112&amp;fmt=jpeg&amp;qlt=80&amp;.v=1604021663000'
        ),
        'c3'
    ),
    (
        'airpods-pro',
        'AirPods Pro',
        FALSE,
        '\n<h3>Magic like you\'ve never heard</h3>\n<p>AirPods Pro have been designed to deliver Active Noise Cancellation for immersive sound, Transparency mode so you can hear your surroundings, and a customizable fit for all-day comfort. Just like AirPods, AirPods Pro connect magically to your iPhone or Apple Watch. And they\'re ready to use right out of the case.\n\n<h3>Active Noise Cancellation</h3>\n<p>Incredibly light noise-cancelling headphones, AirPods Pro block out your environment so you can focus on what you\'re listening to. AirPods Pro use two microphones, an outward-facing microphone and an inward-facing microphone, to create superior noise cancellation. By continuously adapting to the geometry of your ear and the fit of the ear tips, Active Noise Cancellation silences the world to keep you fully tuned in to your music, podcasts, and calls.\n\n<h3>Transparency mode</h3>\n<p>Switch to Transparency mode and AirPods Pro let the outside sound in, allowing you to hear and connect to your surroundings. Outward- and inward-facing microphones enable AirPods Pro to undo the sound-isolating effect of the silicone tips so things sound and feel natural, like when you\'re talking to people around you.</p>\n\n<h3>All-new design</h3>\n<p>AirPods Pro offer a more customizable fit with three sizes of flexible silicone tips to choose from. With an internal taper, they conform to the shape of your ear, securing your AirPods Pro in place and creating an exceptional seal for superior noise cancellation.</p>\n\n<h3>Amazing audio quality</h3>\n<p>A custom-built high-excursion, low-distortion driver delivers powerful bass. A superefficient high dynamic range amplifier produces pure, incredibly clear sound while also extending battery life. And Adaptive EQ automatically tunes music to suit the shape of your ear for a rich, consistent listening experience.</p>\n\n<h3>Even more magical</h3>\n<p>The Apple-designed H1 chip delivers incredibly low audio latency. A force sensor on the stem makes it easy to control music and calls and switch between Active Noise Cancellation and Transparency mode. Announce Messages with Siri gives you the option to have Siri read your messages through your AirPods. And with Audio Sharing, you and a friend can share the same audio stream on two sets of AirPods — so you can play a game, watch a movie, or listen to a song together.</p>\n',
        'Apple',
        JSON_ARRAY (
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1591634795000'
        ),
        'c3'
    ),
    (
        'airtag',
        'AirTag',
        TRUE,
        '\n<h1>Lose your knack for losing things.</h1>\n<p>AirTag is an easy way to keep track of your stuff. Attach one to your keys, slip another one in your backpack. And just like that, they\'re on your radar in the Find My app. AirTag has your back.</p>\n',
        'Apple',
        JSON_ARRAY (
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-double-select-202104?wid=445&hei=370&fmt=jpeg&qlt=95&.v=1617761672000'
        ),
        'c3'
    );

-- Insert attribute sets
INSERT INTO
    attributes (id, name, type, product_id)
VALUES
    -- Nike Air Huarache Size attribute
    (
        'size-huarache',
        'Size',
        'text',
        'huarache-x-stussy-le'
    ),
    -- Jacket Size attribute
    (
        'size-jacket',
        'Size',
        'text',
        'jacket-canada-goosee'
    ),
    -- PS5 attributes
    (
        'color-playstation-5',
        'Color',
        'swatch',
        'playstation-5'
    ),
    (
        'capacity-playstation-5',
        'Capacity',
        'text',
        'playstation-5'
    ),
    -- Xbox attributes
    ('color-xbox', 'Color', 'swatch', 'xbox-series-s'),
    (
        'capacity-xbox',
        'Capacity',
        'text',
        'xbox-series-s'
    ),
    -- iMac attributes
    ('capacity-imac', 'Capacity', 'text', 'imac-2021'),
    (
        'usb3-imac',
        'With USB 3 ports',
        'text',
        'imac-2021'
    ),
    (
        'touchid-imac',
        'Touch ID in keyboard',
        'text',
        'imac-2021'
    ),
    -- iPhone attributes
    (
        'capacity-iphone',
        'Capacity',
        'text',
        'iphone-12-pro'
    ),
    (
        'color-iphone',
        'Color',
        'swatch',
        'iphone-12-pro'
    );

-- Insert attribute values
INSERT INTO
    attribute_values (
        id,
        value,
        display_value,
        attribute_id,
        product_id
    )
VALUES
    -- Nike Air Huarache sizes
    (
        '40',
        '40',
        '40',
        'size-huarache',
        'huarache-x-stussy-le'
    ),
    (
        '41',
        '41',
        '41',
        'size-huarache',
        'huarache-x-stussy-le'
    ),
    (
        '42',
        '42',
        '42',
        'size-huarache',
        'huarache-x-stussy-le'
    ),
    (
        '43',
        '43',
        '43',
        'size-huarache',
        'huarache-x-stussy-le'
    ),
    -- Jacket sizes
    (
        'small',
        'S',
        'Small',
        'size-jacket',
        'jacket-canada-goosee'
    ),
    (
        'medium',
        'M',
        'Medium',
        'size-jacket',
        'jacket-canada-goosee'
    ),
    (
        'large',
        'L',
        'Large',
        'size-jacket',
        'jacket-canada-goosee'
    ),
    (
        'xlarge',
        'XL',
        'Extra Large',
        'size-jacket',
        'jacket-canada-goosee'
    ),
    -- PS5 colors
    (
        'green-playstation-5',
        '#44FF03',
        'Green',
        'color-playstation-5',
        'playstation-5'
    ),
    (
        'cyan-playstation-5',
        '#03FFF7',
        'Cyan',
        'color-playstation-5',
        'playstation-5'
    ),
    (
        'blue-playstation-5',
        '#030BFF',
        'Blue',
        'color-playstation-5',
        'playstation-5'
    ),
    (
        'black-playstation-5',
        '#000000',
        'Black',
        'color-playstation-5',
        'playstation-5'
    ),
    (
        'white-playstation-5',
        '#FFFFFF',
        'White',
        'color-playstation-5',
        'playstation-5'
    ),
    -- PS5 capacities
    (
        '512g-playstation-5',
        '512G',
        '512G',
        'capacity-playstation-5',
        'playstation-5'
    ),
    (
        '1t-playstation-5',
        '1T',
        '1T',
        'capacity-playstation-5',
        'playstation-5'
    ),
    -- Xbox colors
    (
        'green-xbox',
        '#44FF03',
        'Green',
        'color-xbox',
        'xbox-series-s'
    ),
    (
        'cyan-xbox',
        '#03FFF7',
        'Cyan',
        'color-xbox',
        'xbox-series-s'
    ),
    (
        'blue-xbox',
        '#030BFF',
        'Blue',
        'color-xbox',
        'xbox-series-s'
    ),
    (
        'black-xbox',
        '#000000',
        'Black',
        'color-xbox',
        'xbox-series-s'
    ),
    (
        'white-xbox',
        '#FFFFFF',
        'White',
        'color-xbox',
        'xbox-series-s'
    ),
    -- Xbox capacities
    (
        '512g-xbox',
        '512G',
        '512G',
        'capacity-xbox',
        'xbox-series-s'
    ),
    (
        '1t-xbox',
        '1T',
        '1T',
        'capacity-xbox',
        'xbox-series-s'
    ),
    -- iMac capacities
    (
        '256gb-imac',
        '256GB',
        '256GB',
        'capacity-imac',
        'imac-2021'
    ),
    (
        '512gb-imac',
        '512GB',
        '512GB',
        'capacity-imac',
        'imac-2021'
    ),
    -- iMac USB 3 ports
    (
        'yes-usb3',
        'Yes',
        'Yes',
        'usb3-imac',
        'imac-2021'
    ),
    ('no-usb3', 'No', 'No', 'usb3-imac', 'imac-2021'),
    -- iMac Touch ID
    (
        'yes-touchid',
        'Yes',
        'Yes',
        'touchid-imac',
        'imac-2021'
    ),
    (
        'no-touchid',
        'No',
        'No',
        'touchid-imac',
        'imac-2021'
    ),
    -- iPhone capacities
    (
        '512g-iphone',
        '512G',
        '512G',
        'capacity-iphone',
        'iphone-12-pro'
    ),
    (
        '1t-iphone',
        '1T',
        '1T',
        'capacity-iphone',
        'iphone-12-pro'
    ),
    -- iPhone colors
    (
        'green-iphone',
        '#44FF03',
        'Green',
        'color-iphone',
        'iphone-12-pro'
    ),
    (
        'cyan-iphone',
        '#03FFF7',
        'Cyan',
        'color-iphone',
        'iphone-12-pro'
    ),
    (
        'blue-iphone',
        '#030BFF',
        'Blue',
        'color-iphone',
        'iphone-12-pro'
    ),
    (
        'black-iphone',
        '#000000',
        'Black',
        'color-iphone',
        'iphone-12-pro'
    ),
    (
        'white-iphone',
        '#FFFFFF',
        'White',
        'color-iphone',
        'iphone-12-pro'
    );

-- Insert prices
INSERT INTO
    prices (
        amount,
        currency_label,
        currency_symbol,
        product_id
    )
VALUES
    (144.69, 'USD', '$', 'huarache-x-stussy-le'),
    (518.47, 'USD', '$', 'jacket-canada-goosee'),
    (844.02, 'USD', '$', 'playstation-5'),
    (333.99, 'USD', '$', 'xbox-series-s'),
    (1688.03, 'USD', '$', 'imac-2021'),
    (1000.76, 'USD', '$', 'iphone-12-pro'),
    (300.23, 'USD', '$', 'airpods-pro'),
    (120.57, 'USD', '$', 'airtag');
