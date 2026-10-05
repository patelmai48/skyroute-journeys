// Comprehensive Travel Data Store for SkyRoute

export const DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    code: 'GOI',
    tagline: 'Sun-kissed beaches, vibrant nightlife & Portuguese heritage',
    category: 'beach',
    price: 4199,
    rating: 4.8,
    reviews: 1420,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    weather: '29°C Sunny',
    bestTime: 'Nov - Feb',
    durationFromAMD: '1h 45m',
    lat: 15.2993,
    lng: 73.9886,
    attractions: [
      'Baga & Palolem Beach',
      'Fort Aguada & Lighthouse',
      'Dudhsagar Waterfalls',
      'Old Goa Churches (Basilica of Bom Jesus)',
      'Anjuna Flea Market'
    ],
    thingsToDo: [
      'Sunset cruise on Mandovi River',
      'Scuba diving at Grand Island',
      'Authentic Goan fish curry tasting',
      'Scooter ride through Fontainhas Latin Quarter'
    ],
    travelTips: 'Rent a self-drive scooter for the easiest travel between North and South Goa.',
    popularHotels: [
      { name: 'Taj Fort Aguada Resort', rating: 4.9, price: 14500, type: 'Luxury Resort' },
      { name: 'W Goa Vagator', rating: 4.8, price: 18200, type: 'Boutique Beachfront' },
      { name: 'The Leela Goa', rating: 4.9, price: 16000, type: '5-Star Beach Haven' }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    code: 'DEL',
    tagline: 'The historic heart of India with bustling bazaars & Mughal marvels',
    category: 'city',
    price: 3299,
    rating: 4.7,
    reviews: 2180,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    weather: '24°C Pleasant',
    bestTime: 'Oct - Mar',
    durationFromAMD: '1h 30m',
    lat: 28.6139,
    lng: 77.2090,
    attractions: [
      'Qutub Minar & Iron Pillar',
      'India Gate & Kartavya Path',
      'Red Fort & Chandni Chowk',
      'Humayun’s Tomb',
      'Lotus Temple & Akshardham'
    ],
    thingsToDo: [
      'Street food walk in Chandni Chowk',
      'Evening sound & light show at Red Fort',
      'Heritage stroll around Lodhi Gardens',
      'Shopping at Dilli Haat & Khan Market'
    ],
    travelTips: 'Use the Delhi Metro Delhi Airport Express Line for fast, reliable city connectivity.',
    popularHotels: [
      { name: 'The Imperial New Delhi', rating: 4.9, price: 15500, type: 'Heritage Luxury' },
      { name: 'The Leela Palace Chanakyapuri', rating: 4.9, price: 19500, type: '5-Star Opulence' },
      { name: 'Radisson Blu Plaza Delhi Airport', rating: 4.6, price: 7800, type: 'Transit Deluxe' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    code: 'BOM',
    tagline: 'City of Dreams with iconic coastlines, Bollywood & colonial architecture',
    category: 'city',
    price: 2890,
    rating: 4.8,
    reviews: 3100,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    weather: '30°C Coastal Breeze',
    bestTime: 'Oct - Mar',
    durationFromAMD: '1h 15m',
    lat: 19.0760,
    lng: 72.8777,
    attractions: [
      'Gateway of India & Taj Mahal Palace',
      'Marine Drive (Queen’s Necklace)',
      'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
      'Elephanta Caves',
      'Bandra-Worli Sea Link'
    ],
    thingsToDo: [
      'Evening sunset stroll on Marine Drive',
      'Ferry ride to Elephanta Caves',
      'Sampling street-side Vada Pav & Pav Bhaji',
      'Exploring art galleries in Kala Ghoda'
    ],
    travelTips: 'Book local taxis or app-cabs for comfortable transit across south and suburban Mumbai.',
    popularHotels: [
      { name: 'The Taj Mahal Palace, Colaba', rating: 4.9, price: 22000, type: 'Historic Landmark' },
      { name: 'Trident Nariman Point', rating: 4.8, price: 12500, type: 'Seafront Luxury' },
      { name: 'ITC Maratha Mumbai Airport', rating: 4.7, price: 9200, type: '5-Star Airport Luxury' }
    ]
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    country: 'India',
    code: 'BLR',
    tagline: 'Silicon Valley of India with lush gardens, craft breweries & cool climate',
    category: 'city',
    price: 4950,
    rating: 4.7,
    reviews: 1890,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    weather: '23°C Pleasant',
    bestTime: 'Sep - Mar',
    durationFromAMD: '2h 10m',
    lat: 12.9716,
    lng: 77.5946,
    attractions: [
      'Bangalore Palace & Grounds',
      'Lalbagh Botanical Garden & Glass House',
      'Cubbon Park & Vidhana Soudha',
      'Bannerghatta Biological Park',
      'Nandi Hills (Scenic Sunrise)'
    ],
    thingsToDo: [
      'Microbrewery hopping in Indiranagar & Koramangala',
      'Early morning bike ride to Nandi Hills',
      'South Indian breakfast at Vidyarthi Bhavan',
      'Shopping for Mysore silk on Commercial Street'
    ],
    travelTips: 'Leave early for Nandi Hills on weekends to catch the cloud bed sunrise.',
    popularHotels: [
      { name: 'The Leela Palace Bengaluru', rating: 4.9, price: 17500, type: 'Royal Palace' },
      { name: 'ITC Gardenia Bengaluru', rating: 4.8, price: 11000, type: 'Eco-Luxury Hotel' },
      { name: 'The Ritz-Carlton Bangalore', rating: 4.9, price: 15000, type: 'Premium Downtown' }
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    code: 'DXB',
    tagline: 'Futuristic skyline, luxury desert safaris & world-class shopping',
    category: 'international',
    price: 12999,
    rating: 4.9,
    reviews: 4350,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    weather: '28°C Sunny',
    bestTime: 'Nov - Apr',
    durationFromAMD: '3h 30m',
    lat: 25.2048,
    lng: 55.2708,
    attractions: [
      'Burj Khalifa & Dubai Fountain Show',
      'Museum of the Future',
      'Palm Jumeirah & Atlantis The Royal',
      'Dubai Mall & Dubai Aquarium',
      'Desert Safari & Dune Bashing'
    ],
    thingsToDo: [
      'Burj Khalifa Level 148 Observation Deck',
      'Red Dune Desert Safari with BBQ dinner',
      'Yacht cruise around Dubai Marina',
      'Traditional Abra ride across Dubai Creek'
    ],
    travelTips: 'Get the Dubai Pass for bundled admissions and discount transit passes.',
    popularHotels: [
      { name: 'Atlantis, The Palm', rating: 4.9, price: 34000, type: 'Iconic Palm Resort' },
      { name: 'Address Downtown Dubai', rating: 4.9, price: 26000, type: 'Burj View Luxury' },
      { name: 'JW Marriott Marquis Dubai', rating: 4.8, price: 14500, type: 'Skyline Landmark' }
    ]
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    code: 'SIN',
    tagline: 'The Garden City with futuristic domes, hawker feasts & Sentosa fun',
    category: 'international',
    price: 14499,
    rating: 4.9,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    weather: '27°C Tropical',
    bestTime: 'Year-round',
    durationFromAMD: '5h 15m',
    lat: 1.3521,
    lng: 103.8198,
    attractions: [
      'Gardens by the Bay & Supertree Grove',
      'Marina Bay Sands SkyPark & Casino',
      'Universal Studios Singapore (Sentosa)',
      'Jewel Changi Airport Rain Vortex',
      'Singapore Night Safari'
    ],
    thingsToDo: [
      'Light & sound show at Gardens by the Bay',
      'Dining at Lau Pa Sat Hawker Centre (Satay Street)',
      'Cable car ride to Sentosa Island',
      'River safari boat tour'
    ],
    travelTips: 'Singapore MRT is exceptionally fast, clean and covers every major tourist spot.',
    popularHotels: [
      { name: 'Marina Bay Sands', rating: 4.9, price: 38000, type: 'World-Famous Infinity Pool' },
      { name: 'Raffles Singapore', rating: 4.9, price: 48000, type: 'Legendary Heritage' },
      { name: 'Pan Pacific Singapore', rating: 4.7, price: 18000, type: 'Marina View Deluxe' }
    ]
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    code: 'LHR',
    tagline: 'Historic royalty, West End theatre, red double-deckers & River Thames',
    category: 'international',
    price: 34999,
    rating: 4.8,
    reviews: 2900,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    weather: '16°C Mild',
    bestTime: 'May - Sep',
    durationFromAMD: '8h 45m',
    lat: 51.5074,
    lng: -0.1278,
    attractions: [
      'Big Ben & Westminster Abbey',
      'Tower Bridge & Tower of London',
      'British Museum & Natural History Museum',
      'Buckingham Palace & Hyde Park',
      'London Eye on the South Bank'
    ],
    thingsToDo: [
      'Afternoon tea at The Ritz',
      'Watch a West End musical at Covent Garden',
      'Thames River cruise from Westminster to Greenwich',
      'Vintage shopping at Camden & Portobello Market'
    ],
    travelTips: 'Use your contactless credit or debit card for the London Underground Tube.',
    popularHotels: [
      { name: 'The Savoy London', rating: 4.9, price: 42000, type: 'Strand Riverfront Classic' },
      { name: 'The Langham London', rating: 4.8, price: 35000, type: 'West End Grand' },
      { name: 'Park Plaza Westminster Bridge', rating: 4.6, price: 19500, type: 'Big Ben Views' }
    ]
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    code: 'CDG',
    tagline: 'City of Lights with the Eiffel Tower, Louvre masterpieces & romantic cafes',
    category: 'international',
    price: 32499,
    rating: 4.9,
    reviews: 3800,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    weather: '18°C Sunny',
    bestTime: 'Apr - Oct',
    durationFromAMD: '8h 15m',
    lat: 48.8566,
    lng: 2.3522,
    attractions: [
      'Eiffel Tower & Champ de Mars',
      'The Louvre Museum & Mona Lisa',
      'Notre-Dame Cathedral & Sainte-Chapelle',
      'Arc de Triomphe & Champs-Élysées',
      'Montmartre & Sacré-Cœur Basilica'
    ],
    thingsToDo: [
      'Sunset cruise on the River Seine',
      'Pastry and croissant tasting in Le Marais',
      'Picnic by the Eiffel Tower at twilight',
      'Day trip to the Palace of Versailles'
    ],
    travelTips: 'Book Louvre and Eiffel Tower skip-the-line tickets 2-3 weeks in advance.',
    popularHotels: [
      { name: 'Hôtel Plaza Athénée', rating: 4.9, price: 58000, type: 'Fashion District Palace' },
      { name: 'Pullman Paris Tour Eiffel', rating: 4.7, price: 28000, type: 'Direct Eiffel View' },
      { name: 'Novotel Paris Centre Tour Eiffel', rating: 4.5, price: 16500, type: 'Seine Riverside' }
    ]
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    code: 'KUU',
    tagline: 'Snowy Himalayan peaks, pine valleys & thrilling mountain adventures',
    category: 'mountains',
    price: 5499,
    rating: 4.8,
    reviews: 1650,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    weather: '12°C Crisp & Cool',
    bestTime: 'Oct - Jun',
    durationFromAMD: '2h 15m (via Chandigarh)',
    lat: 32.2396,
    lng: 77.1887,
    attractions: [
      'Solang Valley & Rohtang Pass',
      'Hadimba Temple & Cedar Forest',
      'Atal Tunnel & Sissu Waterfall',
      'Jogini Waterfalls Trek',
      'Old Manali Cafes'
    ],
    thingsToDo: [
      'Paragliding over Solang Valley',
      'River rafting on the Beas River',
      'Sip hot mountain tea at riverside cafes',
      'Snow scooter ride at Rohtang Pass'
    ],
    travelTips: 'Carry warm layer jackets even in summer for Rohtang Pass and Atal Tunnel visits.',
    popularHotels: [
      { name: 'The Himalayan Resort & Spa', rating: 4.9, price: 12000, type: 'Victorian Castle' },
      { name: 'Span Resort & Spa', rating: 4.8, price: 14500, type: 'Riverside Luxury' },
      { name: 'Larisa Resort Manali', rating: 4.7, price: 9500, type: 'Orchard Cottages' }
    ]
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    code: 'DPS',
    tagline: 'Emerald rice terraces, spiritual water temples & serene beach villas',
    category: 'relaxation',
    price: 16200,
    rating: 4.9,
    reviews: 2750,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    weather: '28°C Tropical Breeze',
    bestTime: 'Apr - Oct',
    durationFromAMD: '7h 30m',
    lat: -8.4095,
    lng: 115.1889,
    attractions: [
      'Uluwatu Temple & Kecak Fire Dance',
      'Tegallalang Rice Terraces (Ubud)',
      'Tanah Lot Sunset Temple',
      'Mount Batur Sunrise Trek',
      'Nusa Penida Kelingking Beach'
    ],
    thingsToDo: [
      'Sunrise breakfast overlooking Mount Batur',
      'Traditional Balinese spa massage in Ubud',
      'Snorkeling with Manta Rays at Nusa Penida',
      'Beach club sunset at Seminyak'
    ],
    travelTips: 'Rent a private driver for affordable, comfortable day excursions across Ubud and Uluwatu.',
    popularHotels: [
      { name: 'Ayana Resort and Spa Bali', rating: 4.9, price: 24000, type: 'Cliffside Luxury' },
      { name: 'The Kayon Jungle Resort Ubud', rating: 4.9, price: 29000, type: 'Infinity Pool Sanctuary' },
      { name: 'W Bali - Seminyak', rating: 4.8, price: 22500, type: 'Vibrant Beachfront' }
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    code: 'HND',
    tagline: 'Neon skyscrapers, ancient shrines, world-class culinary artistry & anime culture',
    category: 'international',
    price: 38900,
    rating: 4.9,
    reviews: 4120,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    weather: '17°C Crisp',
    bestTime: 'Mar - May, Sep - Nov',
    durationFromAMD: '9h 30m',
    lat: 35.6762,
    lng: 139.6503,
    attractions: [
      'Shibuya Crossing & Hachiko Statue',
      'Senso-ji Temple in Asakusa',
      'Tokyo Skytree & TeamLab Borderless',
      'Meiji Jingu Shrine & Harajuku',
      'Tsukiji Outer Market'
    ],
    thingsToDo: [
      'Omakase sushi tasting at Tsukiji Market',
      'Night view from Shibuya Sky observatory',
      'Tea ceremony experience in Ueno Park',
      'Bullet train ride to Mount Fuji'
    ],
    travelTips: 'Get a Suica or Pasmo IC card for seamless metro, train, and vending machine payments.',
    popularHotels: [
      { name: 'Aman Tokyo', rating: 4.9, price: 72000, type: 'Ultra-Luxury High-Rise' },
      { name: 'Park Hyatt Tokyo (Shinjuku)', rating: 4.8, price: 46000, type: 'Iconic Skyline View' },
      { name: 'Hotel Gracery Shinjuku', rating: 4.6, price: 14500, type: 'Godzilla Landmark Hotel' }
    ]
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    code: 'FCO',
    tagline: 'Colosseum ruins, Vatican treasures, authentic gelato & cobblestone piazzas',
    category: 'international',
    price: 36500,
    rating: 4.8,
    reviews: 3540,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    weather: '21°C Mediterranean Sun',
    bestTime: 'Apr - Jun, Sep - Oct',
    durationFromAMD: '8h 50m',
    lat: 41.9028,
    lng: 12.4964,
    attractions: [
      'The Roman Colosseum & Forum',
      'Vatican Museums & Sistine Chapel',
      'Trevi Fountain & Spanish Steps',
      'Pantheon & Piazza Navona',
      'Trastevere Neighborhood'
    ],
    thingsToDo: [
      'Throw a coin into the Trevi Fountain',
      'Authentic Carbonara & Cacio e Pepe tasting',
      'St. Peter’s Basilica dome climb',
      'Evening gelato walk in Trastevere'
    ],
    travelTips: 'Dress respectfully with shoulders and knees covered when visiting Vatican and basilicas.',
    popularHotels: [
      { name: 'Hotel De Russie Rome', rating: 4.9, price: 62000, type: 'Historic Garden Luxury' },
      { name: 'Anantara Palazzo Naiadi Rome', rating: 4.8, price: 38000, type: 'Piazza Republica Deluxe' },
      { name: 'NH Collection Roma Fori Imperiali', rating: 4.7, price: 24000, type: 'Colosseum Panorama' }
    ]
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    code: 'JFK',
    tagline: 'Times Square neon, Broadway musicals, Central Park & soaring architectural icons',
    category: 'international',
    price: 52000,
    rating: 4.8,
    reviews: 5800,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    weather: '19°C Breezy',
    bestTime: 'Apr - Jun, Sep - Nov',
    durationFromAMD: '15h 20m',
    lat: 40.7128,
    lng: -74.0060,
    attractions: [
      'Empire State Building & Summit One Vanderbilt',
      'Statue of Liberty & Ellis Island',
      'Central Park & The Met Museum',
      'Times Square & Broadway Theatre District',
      'Brooklyn Bridge & DUMBO'
    ],
    thingsToDo: [
      'Watch a Tony-winning Broadway show',
      'Walk across the Brooklyn Bridge at sunset',
      'Picnic at Central Park Sheep Meadow',
      'Ferry cruise past the Statue of Liberty'
    ],
    travelTips: 'Tap your contactless payment card at NYC Subway OMNY turnstiles for fast entry.',
    popularHotels: [
      { name: 'The Plaza New York', rating: 4.9, price: 68000, type: 'Fifth Avenue Legend' },
      { name: 'Arlo NoMad', rating: 4.7, price: 29000, type: 'Boutique Sky Views' },
      { name: 'CitizenM New York Times Square', rating: 4.6, price: 21000, type: 'Modern Central' }
    ]
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    code: 'BKK',
    tagline: 'Golden Buddhist temples, floating markets, rooftop skybars & buzzing street feasts',
    category: 'international',
    price: 11500,
    rating: 4.8,
    reviews: 3670,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    weather: '31°C Tropical Warmth',
    bestTime: 'Nov - Feb',
    durationFromAMD: '4h 10m',
    lat: 13.7563,
    lng: 100.5018,
    attractions: [
      'Grand Palace & Wat Phra Kaew (Emerald Buddha)',
      'Wat Arun (Temple of Dawn)',
      'Chatuchak Weekend Market',
      'Chao Phraya River & IconSiam',
      'Khao San Road & Chinatown'
    ],
    thingsToDo: [
      'Long-tail boat ride through Bangkok canals',
      'Street food safari at Yaowarat Chinatown',
      'Sunset cocktail at Mahanakhon SkyWalk',
      'Traditional Thai massage at Wat Pho'
    ],
    travelTips: 'Use the BTS Skytrain and MRT to bypass Bangkok road traffic during peak hours.',
    popularHotels: [
      { name: 'Capella Bangkok', rating: 4.9, price: 44000, type: 'Riverfront Oasis' },
      { name: 'Banyan Tree Bangkok', rating: 4.8, price: 17500, type: 'Vertigo Sky Rooftop' },
      { name: 'Amari Bangkok', rating: 4.6, price: 8200, type: 'Pratunam Shopping' }
    ]
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    code: 'SYD',
    tagline: 'Iconic Opera House, golden Bondi Beach waves, coastal cliffs & harbour cruises',
    category: 'international',
    price: 46000,
    rating: 4.9,
    reviews: 2950,
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    weather: '22°C Coastal Sunshine',
    bestTime: 'Sep - Nov, Mar - May',
    durationFromAMD: '13h 40m',
    lat: -33.8688,
    lng: 151.2093,
    attractions: [
      'Sydney Opera House & Harbour Bridge',
      'Bondi Beach to Coogee Coastal Walk',
      'Darling Harbour & SEA LIFE Sydney',
      'Manly Beach (via Ferry)',
      'The Rocks Historic District'
    ],
    thingsToDo: [
      'Harbour BridgeClimb adventure',
      'Scenic ferry ride from Circular Quay to Manly',
      'Swim at the iconic Bondi Icebergs Pool',
      'Wine tasting day tour in Hunter Valley'
    ],
    travelTips: 'Opal card or standard contactless bank cards work across all ferries, buses, and trains.',
    popularHotels: [
      { name: 'Park Hyatt Sydney', rating: 4.9, price: 65000, type: 'Unrivalled Opera Views' },
      { name: 'Shangri-La Sydney', rating: 4.8, price: 28000, type: 'Harbour View Deluxe' },
      { name: 'The Grace Hotel', rating: 4.6, price: 16500, type: 'Heritage Central CBD' }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    code: 'JAI',
    tagline: 'The Pink City of grand Rajput palaces, Amer Fort & colourful craft bazaars',
    category: 'city',
    price: 2990,
    rating: 4.8,
    reviews: 2480,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    weather: '26°C Sunny & Dry',
    bestTime: 'Oct - Mar',
    durationFromAMD: '1h 10m',
    lat: 26.9124,
    lng: 75.7873,
    attractions: [
      'Hawa Mahal (Palace of Winds)',
      'Amer Fort & Sheesh Mahal',
      'City Palace & Jantar Mantar',
      'Nahargarh Fort (Sunset Point)',
      'Johari & Bapu Bazaar'
    ],
    thingsToDo: [
      'Hot air balloon safari over Amer Fort',
      'Rajasthani Thali feast at Chokhi Dhani',
      'Block printing workshop in Sanganer',
      'Sunset tea atop Nahargarh Fort'
    ],
    travelTips: 'Get the composite monument ticket for Amer Fort, Hawa Mahal, and Jantar Mantar.',
    popularHotels: [
      { name: 'Rambagh Palace Jaipur', rating: 5.0, price: 38000, type: 'Grand Royal Palace' },
      { name: 'ITC Rajputana Jaipur', rating: 4.8, price: 11500, type: 'Heritage Luxury' },
      { name: 'Shahpura Haveli', rating: 4.7, price: 6500, type: 'Authentic Boutique Haveli' }
    ]
  },
  {
    id: 'kashmir',
    name: 'Srinagar & Kashmir',
    country: 'India',
    code: 'SXR',
    tagline: 'Paradise on Earth with Dal Lake houseboats, Mughal gardens & Gulmarg snow',
    category: 'mountains',
    price: 6800,
    rating: 4.9,
    reviews: 2190,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    weather: '14°C Alpine Fresh',
    bestTime: 'Apr - Oct (Greenery), Dec - Feb (Snow)',
    durationFromAMD: '2h 45m',
    lat: 34.0837,
    lng: 74.7973,
    attractions: [
      'Dal Lake & Floating Flower Market',
      'Shalimar & Nishat Mughal Gardens',
      'Gulmarg Gondola & Apharwat Peak',
      'Pahalgam Betaab Valley & Aru Valley',
      'Sonamarg Thajiwas Glacier'
    ],
    thingsToDo: [
      'Overnight stay on a carved cedarwood Houseboat',
      'Sunrise Shikara ride on Dal Lake with Kahwa tea',
      'Skiing and snowboarding in Gulmarg',
      'Pony trek through pine meadows in Pahalgam'
    ],
    travelTips: 'Pre-book the Gulmarg Gondola Phase 2 tickets online weeks in advance during winter.',
    popularHotels: [
      { name: 'The Khyber Himalayan Resort Gulmarg', rating: 4.9, price: 28000, type: 'Ski Resort & Spa' },
      { name: 'Vivanta Dal View Srinagar', rating: 4.8, price: 18500, type: 'Dal Lake Panorama' },
      { name: 'Mascot Houseboats Dal Lake', rating: 4.7, price: 9500, type: 'Traditional Cedar Heritage' }
    ]
  },
  {
    id: 'kerala',
    name: 'Munnar & Kerala Backwaters',
    country: 'India',
    code: 'COK',
    tagline: 'Emerald tea plantations, tranquil Alleppey houseboats & Ayurvedic wellness',
    category: 'relaxation',
    price: 5900,
    rating: 4.9,
    reviews: 3100,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    weather: '22°C Misty & Green',
    bestTime: 'Sep - Mar',
    durationFromAMD: '2h 20m (to Kochi)',
    lat: 10.0889,
    lng: 77.0595,
    attractions: [
      'Munnar Tea Gardens & Kolukkumalai',
      'Alleppey & Kumarakom Backwaters',
      'Fort Kochi Chinese Fishing Nets',
      'Eravikulam National Park (Nilgiri Tahr)',
      'Athirappilly Waterfalls'
    ],
    thingsToDo: [
      'Day cruise on a traditional Kerala Kettuvallam houseboat',
      'Authentic Kerala Ayurvedic body massage',
      'Tea tasting and factory tour at Lockhart Estate',
      'Kathakali classical dance performance in Fort Kochi'
    ],
    travelTips: 'Fly into Kochi (COK) for easy road transfers to both Munnar hills and Alleppey backwaters.',
    popularHotels: [
      { name: 'Kumarakom Lake Resort', rating: 4.9, price: 22000, type: 'Backwater Heritage' },
      { name: 'Blanket Hotel & Spa Munnar', rating: 4.8, price: 12500, type: 'Attukad Waterfall Views' },
      { name: 'Brunton Boatyard Fort Kochi', rating: 4.8, price: 16000, type: 'Colonial Harbour Luxury' }
    ]
  }
];

export const TRAVEL_CATEGORIES = [
  { id: 'all', label: 'All Places', icon: '✨' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'mountains', label: 'Mountains', icon: '🏔️' },
  { id: 'city', label: 'City', icon: '🌆' },
  { id: 'relaxation', label: 'Relaxation', icon: '🌴' },
  { id: 'adventure', label: 'Adventure', icon: '🎒' },
  { id: 'international', label: 'International', icon: '✈️' }
];

export const OFFERS_DATA = [
  {
    id: 'offer-1',
    code: 'SKYDOM500',
    category: 'domestic',
    title: 'Flat ₹500 OFF on Domestic Flights',
    discount: '₹500 OFF',
    minBooking: '₹3,500',
    validTill: '31 Oct 2026',
    description: 'Save instantly on all domestic one-way and round-trip flight bookings across India.',
    terms: 'Valid on bookings made with any payment method. Minimum transaction value ₹3,500.',
    tag: 'Popular'
  },
  {
    id: 'offer-2',
    code: 'FLYINTL2500',
    category: 'international',
    title: 'Up to ₹2,500 OFF on International Flights',
    discount: '₹2,500 OFF',
    minBooking: '₹15,000',
    validTill: '15 Nov 2026',
    description: 'Fly to Dubai, Singapore, London, Paris & Bali with exclusive international discounts.',
    terms: 'Valid on selected international airlines including Emirates, Singapore Airlines & Air India.',
    tag: 'Top Value'
  },
  {
    id: 'offer-3',
    code: 'HDFCFESTIVE',
    category: 'bank',
    title: '12% Instant Cashback with HDFC Bank Cards',
    discount: '12% Cashback',
    minBooking: '₹5,000',
    validTill: '05 Nov 2026',
    description: 'Use your HDFC Credit or Debit card and get instant 12% discount up to ₹1,800.',
    terms: 'Valid once per card per month. Applicable on Tuesday and Thursday bookings.',
    tag: 'Bank Special'
  },
  {
    id: 'offer-4',
    code: 'STUDENTSKY',
    category: 'student',
    title: 'Student Special: Extra 10kg Baggage + 10% OFF',
    discount: '10% OFF + 10kg',
    minBooking: '₹2,500',
    validTill: '31 Dec 2026',
    description: 'Exclusive perks for students traveling for college, semesters, or holidays with valid Student ID.',
    terms: 'Requires valid Student ID verification at airport check-in counter.',
    tag: 'Students Only'
  },
  {
    id: 'offer-5',
    code: 'FESTIVEFLY',
    category: 'seasonal',
    title: 'Diwali & New Year Holiday Sale',
    discount: 'Flat 15% OFF',
    minBooking: '₹6,000',
    validTill: '30 Nov 2026',
    description: 'Celebrate the festive season with your loved ones. Special fares on holiday routes.',
    terms: 'Applicable for travel dates between Oct 2026 and Jan 2027.',
    tag: 'Festive'
  }
];

export const INSURANCE_PLANS = [
  {
    id: 'basic',
    name: 'Basic Shield',
    price: 199,
    badge: 'Essential',
    coverage: '₹1,00,000',
    features: [
      'Trip Delay Protection (up to ₹3,000)',
      'Baggage Loss Coverage (up to ₹10,000)',
      'Emergency Hospitalization (up to ₹1,00,000)',
      '24/7 Phone Assistance'
    ],
    popular: false
  },
  {
    id: 'standard',
    name: 'SkyRoute Comprehensive',
    price: 449,
    badge: 'Most Popular',
    coverage: '₹5,00,000',
    features: [
      'Trip Cancellation Coverage (up to ₹25,000)',
      'Baggage Loss & Delay (up to ₹30,000)',
      'Emergency Medical & Evacuation (up to ₹5,00,000)',
      'Missed Connection Reimbursement (up to ₹10,000)',
      'Personal Accident Protection',
      '24/7 Global Priority Concierge'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Elite Global Travel Care',
    price: 899,
    badge: 'Maximum Care',
    coverage: '₹25,00,000',
    features: [
      'Zero Deductibles on all claims',
      'Cancel For Any Reason (up to ₹50,000)',
      'Lost Passport & Document Support (up to ₹20,000)',
      'High-tier Medical Cover (up to ₹25,00,000)',
      'Adventure Sports Coverage',
      'VIP Airport Lounge Access on 2h+ Delays'
    ],
    popular: false
  }
];

export const INITIAL_PRICE_ALERTS = [
  {
    id: 'alert-1',
    fromCity: 'Ahmedabad (AMD)',
    toCity: 'Dubai (DXB)',
    currentPrice: 12999,
    targetPrice: 11000,
    status: 'Monitoring',
    dateCreated: '28 Sep 2026',
    trend: 'stable'
  },
  {
    id: 'alert-2',
    fromCity: 'Mumbai (BOM)',
    toCity: 'Goa (GOI)',
    currentPrice: 2890,
    targetPrice: 2500,
    status: 'Price Dropped! 🔔',
    dateCreated: '01 Oct 2026',
    trend: 'dropped'
  },
  {
    id: 'alert-3',
    fromCity: 'Delhi (DEL)',
    toCity: 'Singapore (SIN)',
    currentPrice: 14499,
    targetPrice: 13500,
    status: 'Monitoring',
    dateCreated: '24 Sep 2026',
    trend: 'stable'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'flight',
    title: 'Upcoming Flight Web Check-in Open',
    message: 'Flight 6E-214 to Mumbai departs tomorrow at 06:15 AM from Gate B12 (Terminal T1). Select your complimentary seats now.',
    time: '2 hours ago',
    unread: true,
    link: '/manage-booking'
  },
  {
    id: 'notif-2',
    type: 'price',
    title: 'Price Drop Alert! 📉',
    message: 'Fares for Ahmedabad → Goa dropped by ₹450 (now starting at ₹4,199). Grab tickets before fares rise!',
    time: '4 hours ago',
    unread: true,
    link: '/price-alerts'
  },
  {
    id: 'notif-3',
    type: 'booking',
    title: 'Digital Boarding Pass Generated',
    message: 'Your confirmed booking PNR X7K29P (Seat 14A Window) is ready for download and mobile Apple/Google Wallet sync.',
    time: 'Yesterday',
    unread: false,
    link: '/booking-confirmation'
  },
  {
    id: 'notif-4',
    type: 'flight',
    title: 'Gate & Belt Assignment Notice',
    message: 'Flight AI-805 arriving at Mumbai Airport (BOM) has been assigned Baggage Belt 05 at Terminal T2.',
    time: '1 day ago',
    unread: false,
    link: '/flight-status'
  },
  {
    id: 'notif-5',
    type: 'booking',
    title: 'Hotel Reservation Confirmed',
    message: 'Taj Fort Aguada Resort (Goa) reservation #SR-HTL-94821 is active. Free airport pickup scheduled.',
    time: '2 days ago',
    unread: false,
    link: '/hotels'
  }
];

export const INITIAL_TRIP_PACKING_LIST = [
  { id: 'p1', label: 'Passport & Government ID', category: 'Documents', completed: true },
  { id: 'p2', label: 'Flight Boarding Pass / E-Ticket', category: 'Documents', completed: true },
  { id: 'p3', label: 'Phone & Laptop Charger + Power Bank', category: 'Electronics', completed: true },
  { id: 'p4', label: 'Comfortable Cotton Clothes & Jackets', category: 'Clothing', completed: true },
  { id: 'p5', label: 'Prescription Medicines & First Aid', category: 'Health', completed: true },
  { id: 'p6', label: 'Sunglasses & Sunscreen SPF 50', category: 'Accessories', completed: true },
  { id: 'p7', label: 'Beachwear & Waterproof Pouch', category: 'Clothing', completed: false },
  { id: 'p8', label: 'Noise-Cancelling Headphones', category: 'Electronics', completed: false },
  { id: 'p9', label: 'Travel Pillow & Eye Mask', category: 'Comfort', completed: false },
  { id: 'p10', label: 'Reusable Water Bottle', category: 'Essentials', completed: false }
];

export const INITIAL_GROUP_EXPENSES = [
  { id: 'e1', title: 'Roundtrip Flights (3 Tickets)', amount: 12600, paidBy: 'You', category: 'Flight' },
  { id: 'e2', title: 'Beach Villa 3 Nights (Goa)', amount: 18000, paidBy: 'Rahul Sharma', category: 'Hotel' },
  { id: 'e3', title: 'Seafood Dinner at Fisherman’s Wharf', amount: 3450, paidBy: 'Sneha Patel', category: 'Food' },
  { id: 'e4', title: 'Self-Drive Thar Rental (3 Days)', amount: 4500, paidBy: 'You', category: 'Transport' }
];

export const MOCK_FLIGHT_STATUSES = [
  {
    flightNumber: '6E 201',
    airline: 'IndiGo',
    airlineColor: '#173F3A',
    origin: 'Ahmedabad (AMD)',
    destination: 'Delhi (DEL)',
    scheduledDeparture: '08:00 AM',
    estimatedDeparture: '08:00 AM',
    scheduledArrival: '09:45 AM',
    estimatedArrival: '09:40 AM',
    status: 'On Time',
    gate: 'B12',
    terminal: 'T1',
    baggageBelt: 'Belt 03',
    aircraft: 'A320neo'
  },
  {
    flightNumber: 'AI 805',
    airline: 'Air India',
    airlineColor: '#4F7C73',
    origin: 'Ahmedabad (AMD)',
    destination: 'Mumbai (BOM)',
    scheduledDeparture: '07:45 AM',
    estimatedDeparture: '07:55 AM',
    scheduledArrival: '09:20 AM',
    estimatedArrival: '09:30 AM',
    status: 'Boarding',
    gate: 'A04',
    terminal: 'T2',
    baggageBelt: 'Belt 05',
    aircraft: 'Boeing 787'
  },
  {
    flightNumber: 'UK 952',
    airline: 'Vistara',
    airlineColor: '#173F3A',
    origin: 'Mumbai (BOM)',
    destination: 'Bengaluru (BLR)',
    scheduledDeparture: '11:30 AM',
    estimatedDeparture: '11:30 AM',
    scheduledArrival: '01:10 PM',
    estimatedArrival: '01:10 PM',
    status: 'On Time',
    gate: 'C18',
    terminal: 'T2',
    baggageBelt: 'Belt 01',
    aircraft: 'A321neo'
  },
  {
    flightNumber: 'EK 501',
    airline: 'Emirates',
    airlineColor: '#4F7C73',
    origin: 'Ahmedabad (AMD)',
    destination: 'Dubai (DXB)',
    scheduledDeparture: '04:30 PM',
    estimatedDeparture: '04:30 PM',
    scheduledArrival: '06:45 PM',
    estimatedArrival: '06:45 PM',
    status: 'Scheduled',
    gate: 'D02',
    terminal: 'T2 (Intl)',
    baggageBelt: 'Belt 08',
    aircraft: 'Boeing 777-300ER'
  }
];
