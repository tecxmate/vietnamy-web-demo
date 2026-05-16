// Static scene location and immersive scene seed data.

// ── Scene Locations (neighborhoods) ──
export const SCENE_LOCATIONS = [
    {
        id: "loc_saigon_street",
        name: "Saigon Street Food District",
        name_vi: "Khu phố ẩm thực Sài Gòn",
        emoji: "🏙️",
        gradient: "linear-gradient(135deg, #1a1208 0%, #3d2a10 50%, #1a1208 100%)",
        description: "Bustling sidewalk cafés, bánh mì carts, and noodle stalls.",
        locked: false,
    },
    {
        id: "loc_hanoi_oldquarter",
        name: "Hanoi Old Quarter",
        name_vi: "Phố cổ Hà Nội",
        emoji: "🏮",
        gradient: "linear-gradient(135deg, #2d0a0a 0%, #4a1a1a 50%, #2d0a0a 100%)",
        description: "Narrow alleys, phở shops, and traditional markets.",
        locked: true,
    },
    {
        id: "loc_beach_town",
        name: "Coastal Beach Town",
        name_vi: "Thị trấn ven biển",
        emoji: "🏖️",
        gradient: "linear-gradient(135deg, #0a2d3d 0%, #1a4a5a 50%, #0a2d3d 100%)",
        description: "Seafood restaurants, boat tours, and seaside bargaining.",
        locked: true,
    },
    {
        id: "loc_market",
        name: "Ben Thanh Market",
        name_vi: "Chợ Bến Thành",
        emoji: "🏪",
        gradient: "linear-gradient(135deg, #2d1a0a 0%, #5a3a1a 50%, #2d1a0a 100%)",
        description: "Colorful stalls selling clothes, souvenirs, and fresh produce.",
        locked: false,
    },
    {
        id: "loc_restaurant",
        name: "Local Restaurant",
        name_vi: "Nhà hàng",
        emoji: "🍜",
        gradient: "linear-gradient(135deg, #1a0a0a 0%, #3d1a1a 50%, #1a0a0a 100%)",
        description: "A busy local restaurant with plastic chairs and amazing phở.",
        locked: false,
    },
    {
        id: "loc_street_food",
        name: "Street Food Corner",
        name_vi: "Góc ẩm thực đường phố",
        emoji: "🛵",
        gradient: "linear-gradient(135deg, #1a1a08 0%, #3d3a10 50%, #1a1a08 100%)",
        description: "Tiny plastic stools, smoky grills, and the best bánh mì in town.",
        locked: false,
    },
    {
        id: "loc_taxi",
        name: "City Streets",
        name_vi: "Đường phố",
        emoji: "🚕",
        gradient: "linear-gradient(135deg, #0a1a2d 0%, #1a3a5a 50%, #0a1a2d 100%)",
        description: "Busy intersections, honking motorbikes, and Grab taxis.",
        locked: false,
    },
    {
        id: "loc_airport",
        name: "Tan Son Nhat Airport",
        name_vi: "Sân bay Tân Sơn Nhất",
        emoji: "✈️",
        gradient: "linear-gradient(135deg, #1a1a2d 0%, #2a2a4a 50%, #1a1a2d 100%)",
        description: "Arrivals hall, immigration, and finding your ride.",
        locked: false,
    },
    {
        id: "loc_hotel",
        name: "Budget Hotel",
        name_vi: "Khách sạn",
        emoji: "🏨",
        gradient: "linear-gradient(135deg, #0a2d1a 0%, #1a4a3a 50%, #0a2d1a 100%)",
        description: "A clean guesthouse in the backpacker district.",
        locked: false,
    },
    {
        id: "loc_party",
        name: "Rooftop Bar",
        name_vi: "Quán bar trên sân thượng",
        emoji: "🎉",
        gradient: "linear-gradient(135deg, #2d0a2d 0%, #4a1a4a 50%, #2d0a2d 100%)",
        description: "City lights, cold drinks, and making new Vietnamese friends.",
        locked: false,
    },
];

// ── Immersive Scene Lessons ──
export const SCENES = [
    {
        id: "scene_cafe_001",
        lesson_id: "lesson_006",
        location_id: "loc_saigon_street",
        difficulty: "beginner",
        title: "At the Café",
        title_vi: "Ở quán cà phê",
        scene_type: "narrative",
        setting: {
            background_emoji: "☕",
            background_css: "linear-gradient(135deg, #1a1208 0%, #2d1f0e 100%)"
        },
        characters: [
            { id: "waiter", name: "Anh Minh", role: "Waiter", emoji: "👨‍🍳", personality: "friendly but busy" },
            { id: "friend", name: "Chị Lan", role: "Your friend", emoji: "👩", personality: "helpful" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0030", "it_w_0031", "it_w_0040", "it_w_0041", "it_w_0042", "it_w_0046"],
        grammar_card: {
            title: "Ordering Pattern",
            structure: "Cho tôi + [quantity] + [item]",
            example: "Cho tôi một cà phê sữa đá.",
            translation: "Give me one iced milk coffee."
        },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You just sat down at a sidewalk café. Tap items on the menu to learn the words.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_caphe", label: "Cà phê đen", translation: "Black coffee", audio_key: "a_ca_phe", item_id: "it_w_0030", emoji: "☕", price: "25.000₫", position: { row: 1, col: 1 } },
                        { id: "hs_caphesuada", label: "Cà phê sữa đá", translation: "Iced milk coffee", audio_key: "a_ca_phe_sua_da", item_id: "it_w_0040", emoji: "🥛", price: "30.000₫", position: { row: 1, col: 2 } },
                        { id: "hs_tra", label: "Trà đá", translation: "Iced tea", audio_key: "a_tra", item_id: "it_w_0031", emoji: "🍵", price: "10.000₫", position: { row: 2, col: 1 } },
                        { id: "hs_nuoc", label: "Nước suối", translation: "Water", audio_key: "a_nuoc", item_id: "it_w_0032", emoji: "💧", price: "8.000₫", position: { row: 2, col: 2 } },
                        { id: "hs_banhmi", label: "Bánh mì", translation: "Bread / Sandwich", audio_key: "a_banh_mi", item_id: "it_w_0046", emoji: "🥖", price: "20.000₫", position: { row: 3, col: 1 } },
                        { id: "hs_sua", label: "Sữa tươi", translation: "Fresh milk", audio_key: "a_sua", item_id: "it_w_0041", emoji: "🥛", price: "15.000₫", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch how your friend Lan orders. Tap any word you don't know.",
                    script: [
                        { speaker: "waiter", text_vi: "Chào chị! Chị dùng gì ạ?", text_en: "Hello! What would you like?", hints: { "dùng": "to have", "gì": "what", "ạ": "(polite)" }, emotion: "friendly" },
                        { speaker: "friend", text_vi: "Cho tôi một cà phê sữa đá.", text_en: "Give me one iced milk coffee.", hints: { "cho": "give", "một": "one" }, emotion: "confident", grammar_highlight: "Cho tôi + [item]" },
                        { speaker: "waiter", text_vi: "Dạ. Còn gì nữa không ạ?", text_en: "Sure. Anything else?", hints: { "còn": "more", "nữa": "else", "không": "no?" }, emotion: "attentive" },
                        { speaker: "friend", text_vi: "Dạ, hết rồi. Cảm ơn anh.", text_en: "That's all. Thank you.", hints: { "hết": "finished", "rồi": "already" }, emotion: "satisfied" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Your turn to order!",
                    challenges: [
                        {
                            id: "ch_01",
                            type: "dialogue_choice",
                            scene_beat: "The waiter turns to you. Your friend nudges you under the table.",
                            speaker_prompt: { speaker: "waiter", text_vi: "Còn anh? Dùng gì ạ?", text_en: "And you? What would you like?", emotion: "waiting" },
                            choices: [
                                { text_vi: "Cho tôi một cà phê đen.", correct: true, response_vi: "Dạ, được ạ!", response_en: "Sure thing!", response_emotion: "pleased" },
                                { text_vi: "Tôi là cà phê.", correct: false, response_vi: "Anh... là cà phê?", response_en: "You... are coffee?", response_emotion: "confused" },
                                { text_vi: "Cà phê, cảm ơn.", correct: true, partial: true, tip: "Correct! 'Cho tôi...' is more natural.", response_vi: "Dạ!", response_en: "Sure!", response_emotion: "friendly" }
                            ]
                        },
                        {
                            id: "ch_02",
                            type: "build_sentence",
                            scene_beat: "The waiter asks if you want ice.",
                            speaker_prompt: { speaker: "waiter", text_vi: "Có đá không ạ?", text_en: "With ice?", emotion: "helpful" },
                            answer_tokens: ["Không", "đá"],
                            distractor_tokens: ["sữa", "một"],
                            answer_en: "No ice."
                        },
                        {
                            id: "ch_03",
                            type: "fill_response",
                            scene_beat: "Your friend asks what you ordered.",
                            speaker_prompt: { speaker: "friend", text_vi: "Bạn gọi gì?", text_en: "What did you order?", emotion: "curious" },
                            template_vi: "Tôi gọi ____ đen.",
                            answer: "cà phê",
                            choices: ["cà phê", "trà", "bánh mì", "nước"]
                        },
                        {
                            id: "ch_04",
                            type: "free_speak",
                            scene_beat: "The waiter places a perfect black coffee in front of you. The aroma rises.",
                            speaker_prompt: { speaker: "waiter", text_vi: "Cà phê đen đây ạ.", text_en: "Here's your black coffee.", emotion: "friendly" },
                            target_vi: "Cảm ơn anh!",
                            accept_variations: ["cảm ơn", "cảm ơn anh", "cảm ơn ạ", "cam on", "cam on anh"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "friend", text_vi: "Không phải vậy...", text_en: "(whispers) Not like that...", emotion: "nervous" },
                        { speaker: "waiter", text_vi: "Dạ... xin lỗi?", text_en: "Um... sorry?", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "The waiter smiles. Lan looks impressed. You sip your cà phê đen like a local.", bonus_dong: 5 },
                        good: { scene_beat: "A few stumbles, but you got your coffee! Lan gives you a thumbs up.", bonus_dong: 2 },
                        retry: { scene_beat: "The waiter is patient. Lan helps you out. You'll nail it next time!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 2: Street Food Stall (Unit 4) ──
    {
        id: "scene_streetfood_001",
        lesson_id: "lesson_008",
        location_id: "loc_street_food",
        difficulty: "beginner",
        title: "Street Food Stall",
        title_vi: "Quán ăn vỉa hè",
        scene_type: "narrative",
        setting: { background_emoji: "🛵", background_css: "linear-gradient(135deg, #1a1a08 0%, #3d3a10 100%)" },
        characters: [
            { id: "vendor", name: "Cô Ba", role: "Food vendor", emoji: "👩‍🍳", personality: "loud and cheerful" },
            { id: "friend", name: "Anh Tuấn", role: "Your friend", emoji: "👨", personality: "foodie" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0045", "it_w_0046", "it_w_0047", "it_w_0048", "it_w_0050", "it_w_0051"],
        grammar_card: { title: "Asking Price", structure: "Cái này bao nhiêu tiền?", example: "Cái này bao nhiêu tiền?", translation: "How much is this?" },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You're at a street food stall. Tap items to learn what's on the menu.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_pho", label: "Phở bò", translation: "Beef noodle soup", audio_key: "a_pho_bo", item_id: "it_w_0045", emoji: "🍜", price: "40.000₫", position: { row: 1, col: 1 } },
                        { id: "hs_banhmi2", label: "Bánh mì thịt", translation: "Meat sandwich", audio_key: "a_banh_mi_thit", item_id: "it_w_0046", emoji: "🥖", price: "25.000₫", position: { row: 1, col: 2 } },
                        { id: "hs_buncha", label: "Bún chả", translation: "Grilled pork noodles", audio_key: "a_bun_cha", item_id: "it_w_0047", emoji: "🥢", price: "45.000₫", position: { row: 2, col: 1 } },
                        { id: "hs_com", label: "Cơm tấm", translation: "Broken rice", audio_key: "a_com_tam", item_id: "it_w_0048", emoji: "🍚", price: "35.000₫", position: { row: 2, col: 2 } },
                        { id: "hs_goi", label: "Gỏi cuốn", translation: "Spring rolls", audio_key: "a_goi_cuon", item_id: "it_w_0050", emoji: "🥟", price: "20.000₫", position: { row: 3, col: 1 } },
                        { id: "hs_nuocmia", label: "Nước mía", translation: "Sugarcane juice", audio_key: "a_nuoc_mia", item_id: "it_w_0051", emoji: "🧃", price: "15.000₫", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch Tuấn order food. Tap any word you don't recognize.",
                    script: [
                        { speaker: "vendor", text_vi: "Ăn gì đi em?", text_en: "What'll you eat?", hints: { "ăn": "to eat", "đi": "(urging)" }, emotion: "friendly" },
                        { speaker: "friend", text_vi: "Cho tôi một phở bò. Tái nhé.", text_en: "One beef phở for me. Rare please.", hints: { "tái": "rare (meat)", "nhé": "okay?" }, emotion: "confident" },
                        { speaker: "vendor", text_vi: "Có ăn thêm gì không?", text_en: "Want anything extra?", hints: { "thêm": "more/extra" }, emotion: "attentive" },
                        { speaker: "friend", text_vi: "Thêm một gỏi cuốn nữa.", text_en: "Plus one more spring roll.", hints: { "thêm": "add", "nữa": "more" }, emotion: "satisfied" },
                        { speaker: "vendor", text_vi: "Được rồi! Ngồi đợi nhé!", text_en: "Got it! Sit and wait!", hints: { "ngồi": "sit", "đợi": "wait" }, emotion: "pleased" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Your turn to order street food!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "Cô Ba looks at you expectantly, ladle in hand.",
                            speaker_prompt: { speaker: "vendor", text_vi: "Còn em? Ăn gì?", text_en: "And you? What'll you have?", emotion: "waiting" },
                            choices: [
                                { text_vi: "Cho tôi một cơm tấm.", correct: true, response_vi: "Được! Cơm tấm một!", response_en: "Got it! One broken rice!", response_emotion: "pleased" },
                                { text_vi: "Tôi muốn ăn.", correct: false, response_vi: "Ăn gì? Nói đi!", response_en: "Eat what? Tell me!", response_emotion: "impatient" },
                                { text_vi: "Cơm tấm, cảm ơn cô.", correct: true, partial: true, tip: "Good! 'Cho tôi...' is the full pattern.", response_vi: "Dạ!", response_en: "Sure!", response_emotion: "friendly" }
                            ]
                        },
                        {
                            id: "ch_02", type: "build_sentence",
                            scene_beat: "The vendor asks how many spring rolls you want.",
                            speaker_prompt: { speaker: "vendor", text_vi: "Gỏi cuốn mấy cái?", text_en: "How many spring rolls?", emotion: "helpful" },
                            answer_tokens: ["Hai", "cái"],
                            distractor_tokens: ["một", "phở"],
                            answer_en: "Two."
                        },
                        {
                            id: "ch_03", type: "fill_response",
                            scene_beat: "You want to know the price.",
                            speaker_prompt: { speaker: "player", text_vi: "", text_en: "(You want to ask the price)", emotion: "curious" },
                            template_vi: "Cái này ____ tiền?",
                            answer: "bao nhiêu",
                            choices: ["bao nhiêu", "mấy", "gì", "sao"]
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "Cô Ba brings a steaming plate of cơm tấm with a fried egg on top.",
                            speaker_prompt: { speaker: "vendor", text_vi: "Cơm tấm đây nè!", text_en: "Here's your broken rice!", emotion: "pleased" },
                            target_vi: "Cảm ơn cô!",
                            accept_variations: ["cảm ơn", "cảm ơn cô", "cam on", "cam on co"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "friend", text_vi: "Nói lại đi...", text_en: "Try again...", emotion: "nervous" },
                        { speaker: "vendor", text_vi: "Hả? Cái gì?", text_en: "Huh? What?", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "Cô Ba gives you an extra spring roll. 'Ăn giỏi lắm!' she laughs.", bonus_dong: 5 },
                        good: { scene_beat: "The food arrives. Tuấn helps with the chili sauce. Delicious!", bonus_dong: 2 },
                        retry: { scene_beat: "Tuấn orders for you. Next time you'll do it yourself!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 3: At the Market (Unit 5) ──
    {
        id: "scene_market_001",
        lesson_id: "lesson_010",
        location_id: "loc_market",
        difficulty: "elementary",
        title: "At the Market",
        title_vi: "Ở chợ",
        scene_type: "narrative",
        setting: { background_emoji: "🛒", background_css: "linear-gradient(135deg, #2d1a0a 0%, #5a3a1a 100%)" },
        characters: [
            { id: "seller", name: "Chị Hoa", role: "Market seller", emoji: "👩‍🌾", personality: "persuasive and warm" },
            { id: "friend", name: "Chị Lan", role: "Your friend", emoji: "👩", personality: "savvy shopper" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0060", "it_w_0061", "it_w_0062", "it_w_0063", "it_w_0064", "it_w_0065"],
        grammar_card: { title: "Bargaining Pattern", structure: "Bớt cho tôi đi! / Rẻ hơn được không?", example: "Bớt cho tôi đi!", translation: "Give me a discount!" },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You're browsing the market. Tap items to learn their names and prices.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_ao", label: "Áo thun", translation: "T-shirt", audio_key: "a_ao_thun", item_id: "it_w_0060", emoji: "👕", price: "150.000₫", position: { row: 1, col: 1 } },
                        { id: "hs_non", label: "Nón lá", translation: "Leaf hat", audio_key: "a_non_la", item_id: "it_w_0061", emoji: "🎩", price: "80.000₫", position: { row: 1, col: 2 } },
                        { id: "hs_dep", label: "Dép", translation: "Sandals", audio_key: "a_dep", item_id: "it_w_0062", emoji: "🩴", price: "120.000₫", position: { row: 2, col: 1 } },
                        { id: "hs_tui", label: "Túi xách", translation: "Bag", audio_key: "a_tui_xach", item_id: "it_w_0063", emoji: "👜", price: "200.000₫", position: { row: 2, col: 2 } },
                        { id: "hs_do", label: "Đỏ", translation: "Red", audio_key: "a_do", item_id: "it_w_0064", emoji: "🔴", price: "—", position: { row: 3, col: 1 } },
                        { id: "hs_xanh", label: "Xanh", translation: "Blue/Green", audio_key: "a_xanh", item_id: "it_w_0065", emoji: "🔵", price: "—", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch Lan bargain like a pro. Tap words you don't know.",
                    script: [
                        { speaker: "seller", text_vi: "Mua gì đi em! Đồ đẹp lắm!", text_en: "Buy something! Beautiful stuff!", hints: { "mua": "buy", "đồ": "stuff", "đẹp": "beautiful" }, emotion: "friendly" },
                        { speaker: "friend", text_vi: "Cái áo này bao nhiêu tiền?", text_en: "How much is this shirt?", hints: { "cái": "classifier", "bao nhiêu": "how much" }, emotion: "curious" },
                        { speaker: "seller", text_vi: "Hai trăm nghìn thôi.", text_en: "Only 200 thousand.", hints: { "trăm": "hundred", "nghìn": "thousand", "thôi": "only" }, emotion: "confident" },
                        { speaker: "friend", text_vi: "Mắc quá! Một trăm năm chục được không?", text_en: "Too expensive! 150k okay?", hints: { "mắc": "expensive", "quá": "too" }, emotion: "confident", grammar_highlight: "Bớt cho tôi đi!" },
                        { speaker: "seller", text_vi: "Được rồi, lấy đi em!", text_en: "Fine, take it!", hints: { "lấy": "take" }, emotion: "satisfied" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Your turn to bargain at the market!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "You spot a beautiful nón lá (leaf hat). The seller notices your interest.",
                            speaker_prompt: { speaker: "seller", text_vi: "Nón đẹp lắm! Mua đi em!", text_en: "Beautiful hat! Buy it!", emotion: "friendly" },
                            choices: [
                                { text_vi: "Cái này bao nhiêu tiền?", correct: true, response_vi: "Tám chục nghìn thôi!", response_en: "Only 80 thousand!", response_emotion: "confident" },
                                { text_vi: "Tôi không thích.", correct: false, response_vi: "Ơ, nhưng mà đẹp mà!", response_en: "But it's pretty!", response_emotion: "confused" },
                                { text_vi: "Bao nhiêu?", correct: true, partial: true, tip: "Add 'cái này' and 'tiền' for the full pattern.", response_vi: "Tám chục!", response_en: "Eighty!", response_emotion: "friendly" }
                            ]
                        },
                        {
                            id: "ch_02", type: "build_sentence",
                            scene_beat: "80k seems too much. Time to bargain!",
                            speaker_prompt: { speaker: "player", text_vi: "", text_en: "(You want to say: Too expensive!)", emotion: "confident" },
                            answer_tokens: ["Mắc", "quá"],
                            distractor_tokens: ["đẹp", "rẻ"],
                            answer_en: "Too expensive!"
                        },
                        {
                            id: "ch_03", type: "fill_response",
                            scene_beat: "The seller offers 70k. You counter.",
                            speaker_prompt: { speaker: "seller", text_vi: "Bảy chục nhé?", text_en: "70k okay?", emotion: "helpful" },
                            template_vi: "Năm ____ được không?",
                            answer: "chục",
                            choices: ["chục", "trăm", "nghìn", "mười"]
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "Deal! The seller wraps the hat and hands it to you with a smile.",
                            speaker_prompt: { speaker: "seller", text_vi: "Đây nè! Đội đẹp lắm!", text_en: "Here! Looks great on you!", emotion: "pleased" },
                            target_vi: "Cảm ơn chị!",
                            accept_variations: ["cảm ơn", "cảm ơn chị", "cam on", "cam on chi"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "friend", text_vi: "Nói lại đi bạn...", text_en: "Say it again...", emotion: "nervous" },
                        { speaker: "seller", text_vi: "Sao? Em nói gì?", text_en: "What? What'd you say?", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "Chị Hoa throws in a free keychain. 'Giỏi quá!' she says. Lan is impressed.", bonus_dong: 5 },
                        good: { scene_beat: "You got a decent price! Lan says you'll be a pro next time.", bonus_dong: 2 },
                        retry: { scene_beat: "Lan takes over the bargaining. You'll get there!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 4: At the Restaurant (Unit 6) ──
    {
        id: "scene_restaurant_001",
        lesson_id: "lesson_012",
        location_id: "loc_restaurant",
        difficulty: "elementary",
        title: "At the Restaurant",
        title_vi: "Ở nhà hàng",
        scene_type: "narrative",
        setting: { background_emoji: "🍜", background_css: "linear-gradient(135deg, #1a0a0a 0%, #3d1a1a 100%)" },
        characters: [
            { id: "waiter", name: "Em Hà", role: "Waitress", emoji: "👩‍🍳", personality: "polite and efficient" },
            { id: "friend", name: "Chị Lan", role: "Your friend", emoji: "👩", personality: "helpful" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0080", "it_w_0081", "it_w_0082", "it_w_0090", "it_w_0091", "it_w_0092"],
        grammar_card: { title: "Quantity Pattern", structure: "[Number] + [classifier] + [noun]", example: "Hai tô phở bò.", translation: "Two bowls of beef phở." },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You're at a local restaurant. Tap dishes on the menu.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_pho2", label: "Phở bò", translation: "Beef noodle soup", audio_key: "a_pho_bo", item_id: "it_w_0080", emoji: "🍜", price: "50.000₫", position: { row: 1, col: 1 } },
                        { id: "hs_bun2", label: "Bún bò Huế", translation: "Huế spicy noodles", audio_key: "a_bun_bo_hue", item_id: "it_w_0081", emoji: "🥢", price: "55.000₫", position: { row: 1, col: 2 } },
                        { id: "hs_mi", label: "Mì xào", translation: "Stir-fried noodles", audio_key: "a_mi_xao", item_id: "it_w_0082", emoji: "🍝", price: "45.000₫", position: { row: 2, col: 1 } },
                        { id: "hs_com2", label: "Cơm chiên", translation: "Fried rice", audio_key: "a_com_chien", item_id: "it_w_0090", emoji: "🍚", price: "40.000₫", position: { row: 2, col: 2 } },
                        { id: "hs_rau", label: "Rau muống xào", translation: "Stir-fried morning glory", audio_key: "a_rau_muong", item_id: "it_w_0091", emoji: "🥬", price: "30.000₫", position: { row: 3, col: 1 } },
                        { id: "hs_bia", label: "Bia Sài Gòn", translation: "Saigon beer", audio_key: "a_bia", item_id: "it_w_0092", emoji: "🍺", price: "20.000₫", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch Lan order a full meal. Tap any new words.",
                    script: [
                        { speaker: "waiter", text_vi: "Chào anh chị! Dùng gì ạ?", text_en: "Hello! What would you like?", hints: { "dùng": "to have" }, emotion: "friendly" },
                        { speaker: "friend", text_vi: "Cho tôi hai tô phở bò.", text_en: "Give me two bowls of beef phở.", hints: { "tô": "bowl (classifier)", "hai": "two" }, emotion: "confident", grammar_highlight: "[Number] + [classifier] + [noun]" },
                        { speaker: "friend", text_vi: "Với một đĩa rau muống xào.", text_en: "And one plate of stir-fried morning glory.", hints: { "với": "and/with", "đĩa": "plate (classifier)" }, emotion: "confident" },
                        { speaker: "waiter", text_vi: "Uống gì ạ?", text_en: "What to drink?", hints: { "uống": "to drink" }, emotion: "attentive" },
                        { speaker: "friend", text_vi: "Hai bia Sài Gòn. Cảm ơn em.", text_en: "Two Saigon beers. Thanks.", hints: {}, emotion: "satisfied" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Order a meal for yourself!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "The waitress turns to you with her notepad.",
                            speaker_prompt: { speaker: "waiter", text_vi: "Anh dùng gì ạ?", text_en: "What would you like?", emotion: "waiting" },
                            choices: [
                                { text_vi: "Cho tôi một tô phở bò.", correct: true, response_vi: "Dạ được ạ!", response_en: "Sure!", response_emotion: "pleased" },
                                { text_vi: "Phở bò tôi là.", correct: false, response_vi: "Dạ... anh nói lại?", response_en: "Sorry... say again?", response_emotion: "confused" },
                                { text_vi: "Một phở bò.", correct: true, partial: true, tip: "Add 'tô' (bowl) for proper classifier usage!", response_vi: "Dạ!", response_en: "Got it!", response_emotion: "friendly" }
                            ]
                        },
                        {
                            id: "ch_02", type: "build_sentence",
                            scene_beat: "You also want fried rice.",
                            speaker_prompt: { speaker: "waiter", text_vi: "Còn gì nữa không ạ?", text_en: "Anything else?", emotion: "attentive" },
                            answer_tokens: ["Một", "đĩa", "cơm", "chiên"],
                            distractor_tokens: ["tô", "rau"],
                            answer_en: "One plate of fried rice."
                        },
                        {
                            id: "ch_03", type: "fill_response",
                            scene_beat: "Lan asks what you're drinking.",
                            speaker_prompt: { speaker: "friend", text_vi: "Bạn uống gì?", text_en: "What are you drinking?", emotion: "curious" },
                            template_vi: "Tôi uống ____ Sài Gòn.",
                            answer: "bia",
                            choices: ["bia", "nước", "trà", "cà phê"]
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "The waitress brings everything. Steam rises from the phở. It smells incredible.",
                            speaker_prompt: { speaker: "waiter", text_vi: "Phở bò và cơm chiên đây ạ. Chúc ngon miệng!", text_en: "Here's your phở and fried rice. Enjoy!", emotion: "pleased" },
                            target_vi: "Cảm ơn em!",
                            accept_variations: ["cảm ơn", "cảm ơn em", "cam on", "cam on em"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "friend", text_vi: "Gần đúng rồi...", text_en: "Almost right...", emotion: "nervous" },
                        { speaker: "waiter", text_vi: "Dạ... em chưa hiểu?", text_en: "Sorry... I didn't catch that?", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "The waitress smiles. Lan says 'Bạn giỏi lắm!' The phở is the best you've ever had.", bonus_dong: 5 },
                        good: { scene_beat: "A couple of mix-ups, but you got your meal! The phở makes it all worth it.", bonus_dong: 2 },
                        retry: { scene_beat: "Lan helps out. The food is still amazing. Practice makes perfect!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 5: Getting a Taxi (Unit 7) ──
    {
        id: "scene_taxi_001",
        lesson_id: "lesson_014",
        location_id: "loc_taxi",
        difficulty: "elementary",
        title: "Getting a Taxi",
        title_vi: "Đi taxi",
        scene_type: "narrative",
        setting: { background_emoji: "🚕", background_css: "linear-gradient(135deg, #0a1a2d 0%, #1a3a5a 100%)" },
        characters: [
            { id: "driver", name: "Anh Hùng", role: "Taxi driver", emoji: "🧑‍✈️", personality: "chatty and helpful" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0100", "it_w_0102", "it_w_0103", "it_w_0104", "it_w_0105", "it_w_0106"],
        grammar_card: { title: "Giving Directions", structure: "Cho tôi đến + [place]", example: "Cho tôi đến chợ Bến Thành.", translation: "Take me to Ben Thanh Market." },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You need a taxi. Learn the key phrases for giving directions.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_rere", label: "Rẽ phải", translation: "Turn right", audio_key: "a_re_phai", item_id: "it_w_0100", emoji: "➡️", price: "—", position: { row: 1, col: 1 } },
                        { id: "hs_reli", label: "Rẽ trái", translation: "Turn left", audio_key: "a_re_trai", item_id: "it_w_0102", emoji: "⬅️", price: "—", position: { row: 1, col: 2 } },
                        { id: "hs_thang", label: "Đi thẳng", translation: "Go straight", audio_key: "a_di_thang", item_id: "it_w_0103", emoji: "⬆️", price: "—", position: { row: 2, col: 1 } },
                        { id: "hs_dung", label: "Dừng lại", translation: "Stop here", audio_key: "a_dung_lai", item_id: "it_w_0104", emoji: "🛑", price: "—", position: { row: 2, col: 2 } },
                        { id: "hs_gan", label: "Gần", translation: "Near", audio_key: "a_gan", item_id: "it_w_0105", emoji: "📍", price: "—", position: { row: 3, col: 1 } },
                        { id: "hs_xa", label: "Xa", translation: "Far", audio_key: "a_xa", item_id: "it_w_0106", emoji: "🗺️", price: "—", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Listen to a taxi ride conversation. Tap new words.",
                    script: [
                        { speaker: "driver", text_vi: "Chào anh! Đi đâu?", text_en: "Hello! Where to?", hints: { "đi": "go", "đâu": "where" }, emotion: "friendly" },
                        { speaker: "player", text_vi: "Cho tôi đến chợ Bến Thành.", text_en: "Take me to Ben Thanh Market.", hints: { "đến": "to/arrive" }, emotion: "confident", grammar_highlight: "Cho tôi đến + [place]" },
                        { speaker: "driver", text_vi: "Được rồi. Khoảng 15 phút nhé.", text_en: "Sure. About 15 minutes.", hints: { "khoảng": "about", "phút": "minutes" }, emotion: "helpful" },
                        { speaker: "driver", text_vi: "Rẽ phải hay rẽ trái ở đây?", text_en: "Turn right or left here?", hints: { "hay": "or", "ở đây": "here" }, emotion: "attentive" },
                        { speaker: "player", text_vi: "Rẽ phải, rồi đi thẳng.", text_en: "Turn right, then go straight.", hints: { "rồi": "then" }, emotion: "confident" },
                        { speaker: "driver", text_vi: "Đến rồi! Bốn chục nghìn.", text_en: "We're here! 40 thousand.", hints: { "đến rồi": "arrived" }, emotion: "pleased" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "You need to get to your hotel. Take a taxi!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "You flag down a taxi. The driver rolls down the window.",
                            speaker_prompt: { speaker: "driver", text_vi: "Chào anh! Đi đâu?", text_en: "Hello! Where to?", emotion: "friendly" },
                            choices: [
                                { text_vi: "Cho tôi đến khách sạn.", correct: true, response_vi: "Được! Khách sạn nào?", response_en: "Sure! Which hotel?", response_emotion: "helpful" },
                                { text_vi: "Tôi là khách sạn.", correct: false, response_vi: "Anh... là khách sạn?", response_en: "You... are a hotel?", response_emotion: "confused" },
                                { text_vi: "Khách sạn, anh ơi.", correct: true, partial: true, tip: "Good! 'Cho tôi đến...' is the full pattern.", response_vi: "OK!", response_en: "OK!", response_emotion: "friendly" }
                            ]
                        },
                        {
                            id: "ch_02", type: "build_sentence",
                            scene_beat: "The driver reaches an intersection and asks you.",
                            speaker_prompt: { speaker: "driver", text_vi: "Ở đây rẽ đâu?", text_en: "Which way to turn here?", emotion: "attentive" },
                            answer_tokens: ["Rẽ", "trái"],
                            distractor_tokens: ["phải", "thẳng"],
                            answer_en: "Turn left."
                        },
                        {
                            id: "ch_03", type: "fill_response",
                            scene_beat: "You see the hotel ahead. Time to stop!",
                            speaker_prompt: { speaker: "player", text_vi: "", text_en: "(You need the driver to stop)", emotion: "confident" },
                            template_vi: "____ lại, anh ơi!",
                            answer: "Dừng",
                            choices: ["Dừng", "Đi", "Rẽ", "Đến"]
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "You've arrived! The meter says 40k. You hand over the money.",
                            speaker_prompt: { speaker: "driver", text_vi: "Đến rồi! Bốn chục nghìn nhé.", text_en: "We're here! 40 thousand.", emotion: "friendly" },
                            target_vi: "Cảm ơn anh!",
                            accept_variations: ["cảm ơn", "cảm ơn anh", "cam on", "cam on anh"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "driver", text_vi: "Hả? Đi đâu?", text_en: "Huh? Go where?", emotion: "confused" },
                        { speaker: "driver", text_vi: "Anh nói lại nhé.", text_en: "Say that again please.", emotion: "helpful" }
                    ],
                    endings: {
                        perfect: { scene_beat: "The driver says 'Anh nói tiếng Việt giỏi lắm!' and gives you his card for next time.", bonus_dong: 5 },
                        good: { scene_beat: "You made it! A couple of wrong turns, but you arrived safely.", bonus_dong: 2 },
                        retry: { scene_beat: "The driver used Google Maps instead. You'll navigate in Vietnamese next time!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 6: At the Airport (Unit 7) ──
    {
        id: "scene_airport_001",
        lesson_id: "lesson_016",
        location_id: "loc_airport",
        difficulty: "elementary",
        title: "At the Airport",
        title_vi: "Ở sân bay",
        scene_type: "narrative",
        setting: { background_emoji: "✈️", background_css: "linear-gradient(135deg, #1a1a2d 0%, #2a2a4a 100%)" },
        characters: [
            { id: "officer", name: "Chị Mai", role: "Information desk", emoji: "👩‍💼", personality: "professional and patient" },
            { id: "driver", name: "Anh Bảo", role: "Pickup driver", emoji: "🧑‍✈️", personality: "friendly" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0100", "it_w_0103", "it_w_0104", "it_w_0105", "it_w_0106"],
        grammar_card: { title: "Asking for Help", structure: "Xin lỗi, [question] ở đâu?", example: "Xin lỗi, nhà vệ sinh ở đâu?", translation: "Excuse me, where is the restroom?" },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You just landed at the airport. Tap signs to learn key words.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_ra", label: "Lối ra", translation: "Exit", audio_key: "a_loi_ra", item_id: "it_w_0100", emoji: "🚪", price: "—", position: { row: 1, col: 1 } },
                        { id: "hs_wc", label: "Nhà vệ sinh", translation: "Restroom", audio_key: "a_nha_ve_sinh", item_id: "it_w_0103", emoji: "🚻", price: "—", position: { row: 1, col: 2 } },
                        { id: "hs_doi", label: "Đổi tiền", translation: "Currency exchange", audio_key: "a_doi_tien", item_id: "it_w_0104", emoji: "💱", price: "—", position: { row: 2, col: 1 } },
                        { id: "hs_taxi2", label: "Taxi", translation: "Taxi stand", audio_key: "a_taxi", item_id: "it_w_0105", emoji: "🚕", price: "—", position: { row: 2, col: 2 } },
                        { id: "hs_sim", label: "Mua SIM", translation: "Buy SIM card", audio_key: "a_mua_sim", item_id: "it_w_0106", emoji: "📱", price: "100.000₫", position: { row: 3, col: 1 } },
                        { id: "hs_hanhly", label: "Hành lý", translation: "Luggage", audio_key: "a_hanh_ly", item_id: "it_w_0100", emoji: "🧳", price: "—", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch how to ask for help at the information desk.",
                    script: [
                        { speaker: "player", text_vi: "Xin lỗi chị, lối ra ở đâu?", text_en: "Excuse me, where is the exit?", hints: { "xin lỗi": "excuse me", "lối ra": "exit", "ở đâu": "where" }, emotion: "curious" },
                        { speaker: "officer", text_vi: "Đi thẳng, rồi rẽ trái.", text_en: "Go straight, then turn left.", hints: { "đi thẳng": "go straight", "rẽ trái": "turn left" }, emotion: "helpful" },
                        { speaker: "player", text_vi: "Cảm ơn chị. Chỗ đổi tiền ở đâu?", text_en: "Thank you. Where's the currency exchange?", hints: { "chỗ": "place", "đổi tiền": "exchange money" }, emotion: "curious" },
                        { speaker: "officer", text_vi: "Ở bên phải, gần lối ra.", text_en: "On the right, near the exit.", hints: { "bên phải": "right side", "gần": "near" }, emotion: "friendly" },
                        { speaker: "player", text_vi: "Dạ, cảm ơn chị nhiều.", text_en: "Thank you very much.", hints: { "nhiều": "a lot" }, emotion: "satisfied" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Navigate the airport on your own!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "You need to find the restroom. You see an information desk.",
                            speaker_prompt: { speaker: "officer", text_vi: "Tôi giúp gì cho anh?", text_en: "How can I help you?", emotion: "helpful" },
                            choices: [
                                { text_vi: "Xin lỗi, nhà vệ sinh ở đâu?", correct: true, response_vi: "Đi thẳng, bên trái ạ.", response_en: "Go straight, on the left.", response_emotion: "helpful" },
                                { text_vi: "Tôi muốn nhà vệ sinh.", correct: true, partial: true, tip: "'Ở đâu?' is the natural question pattern.", response_vi: "Ở bên trái ạ.", response_en: "On the left.", response_emotion: "friendly" },
                                { text_vi: "Nhà vệ sinh tôi.", correct: false, response_vi: "Dạ... anh cần gì ạ?", response_en: "Sorry... what do you need?", response_emotion: "confused" }
                            ]
                        },
                        {
                            id: "ch_02", type: "fill_response",
                            scene_beat: "Your pickup driver is calling. He asks where you are.",
                            speaker_prompt: { speaker: "driver", text_vi: "Anh ở đâu rồi?", text_en: "Where are you now?", emotion: "curious" },
                            template_vi: "Tôi ở ____ lối ra.",
                            answer: "gần",
                            choices: ["gần", "xa", "trên", "trong"]
                        },
                        {
                            id: "ch_03", type: "build_sentence",
                            scene_beat: "The driver says he's in a white car outside. You need to tell him you're coming.",
                            speaker_prompt: { speaker: "driver", text_vi: "Xe trắng ở ngoài nhé!", text_en: "White car outside!", emotion: "friendly" },
                            answer_tokens: ["Tôi", "ra", "ngay"],
                            distractor_tokens: ["đi", "vào"],
                            answer_en: "I'm coming right out."
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "You find the car. Anh Bảo gets out and grabs your luggage.",
                            speaker_prompt: { speaker: "driver", text_vi: "Chào anh! Để tôi xách hành lý cho!", text_en: "Hello! Let me carry your luggage!", emotion: "friendly" },
                            target_vi: "Cảm ơn anh!",
                            accept_variations: ["cảm ơn", "cảm ơn anh", "cam on", "cam on anh", "cảm ơn anh nhiều"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "officer", text_vi: "Anh nói lại nhé?", text_en: "Can you repeat that?", emotion: "helpful" },
                        { speaker: "driver", text_vi: "Hả? Ở đâu?", text_en: "Huh? Where?", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "Anh Bảo is impressed. 'Anh nói tiếng Việt hay lắm!' You're off to a great start.", bonus_dong: 5 },
                        good: { scene_beat: "You made it out of the airport! A few hiccups but you found everything.", bonus_dong: 2 },
                        retry: { scene_beat: "You used the airport map instead. Next visit will be smoother!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 7: Checking into a Hotel (Unit 8) ──
    {
        id: "scene_hotel_001",
        lesson_id: "lesson_020",
        location_id: "loc_hotel",
        difficulty: "intermediate",
        title: "Checking into a Hotel",
        title_vi: "Nhận phòng khách sạn",
        scene_type: "narrative",
        setting: { background_emoji: "🏨", background_css: "linear-gradient(135deg, #0a2d1a 0%, #1a4a3a 100%)" },
        characters: [
            { id: "receptionist", name: "Chị Thảo", role: "Receptionist", emoji: "👩‍💼", personality: "professional and warm" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0145", "it_w_0146", "it_w_0147", "it_w_0166", "it_w_0167", "it_w_0168"],
        grammar_card: { title: "Duration Pattern", structure: "[Number] + đêm (nights) / ngày (days)", example: "Tôi ở ba đêm.", translation: "I'm staying three nights." },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You're at the hotel front desk. Learn the key check-in vocabulary.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_phong", label: "Phòng đơn", translation: "Single room", audio_key: "a_phong_don", item_id: "it_w_0145", emoji: "🛏️", price: "400.000₫", position: { row: 1, col: 1 } },
                        { id: "hs_phong2", label: "Phòng đôi", translation: "Double room", audio_key: "a_phong_doi", item_id: "it_w_0146", emoji: "🛏️", price: "600.000₫", position: { row: 1, col: 2 } },
                        { id: "hs_dem", label: "Đêm", translation: "Night", audio_key: "a_dem", item_id: "it_w_0147", emoji: "🌙", price: "—", position: { row: 2, col: 1 } },
                        { id: "hs_wifi", label: "Wi-Fi", translation: "Wi-Fi", audio_key: "a_wifi", item_id: "it_w_0166", emoji: "📶", price: "Free", position: { row: 2, col: 2 } },
                        { id: "hs_buasan", label: "Bữa sáng", translation: "Breakfast", audio_key: "a_bua_sang", item_id: "it_w_0167", emoji: "🍳", price: "50.000₫", position: { row: 3, col: 1 } },
                        { id: "hs_chiakhoa", label: "Chìa khóa", translation: "Key", audio_key: "a_chia_khoa", item_id: "it_w_0168", emoji: "🔑", price: "—", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch a check-in conversation. Tap any new words.",
                    script: [
                        { speaker: "receptionist", text_vi: "Chào anh! Anh đặt phòng chưa?", text_en: "Hello! Have you booked a room?", hints: { "đặt": "book/reserve", "chưa": "yet?" }, emotion: "friendly" },
                        { speaker: "player", text_vi: "Rồi ạ. Tôi đặt phòng đôi, ba đêm.", text_en: "Yes. I booked a double room, three nights.", hints: { "rồi": "already/yes", "ba": "three" }, emotion: "confident" },
                        { speaker: "receptionist", text_vi: "Dạ, phòng 305. Có bữa sáng và Wi-Fi miễn phí.", text_en: "Room 305. Includes breakfast and free Wi-Fi.", hints: { "miễn phí": "free" }, emotion: "helpful" },
                        { speaker: "receptionist", text_vi: "Đây là chìa khóa. Thang máy ở bên phải.", text_en: "Here's the key. Elevator is on the right.", hints: { "thang máy": "elevator", "bên phải": "right side" }, emotion: "friendly" },
                        { speaker: "player", text_vi: "Cảm ơn chị!", text_en: "Thank you!", hints: {}, emotion: "satisfied" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Check into the hotel yourself!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "You walk up to the front desk. The receptionist greets you.",
                            speaker_prompt: { speaker: "receptionist", text_vi: "Chào anh! Tôi giúp gì ạ?", text_en: "Hello! How can I help?", emotion: "friendly" },
                            choices: [
                                { text_vi: "Tôi muốn đặt phòng đơn, hai đêm.", correct: true, response_vi: "Dạ, còn phòng ạ!", response_en: "Yes, we have rooms!", response_emotion: "pleased" },
                                { text_vi: "Phòng. Hai.", correct: false, response_vi: "Dạ... phòng gì ạ?", response_en: "What kind of room?", response_emotion: "confused" },
                                { text_vi: "Một phòng đơn.", correct: true, partial: true, tip: "Add how many nights: 'hai đêm'.", response_vi: "Mấy đêm ạ?", response_en: "How many nights?", response_emotion: "helpful" }
                            ]
                        },
                        {
                            id: "ch_02", type: "fill_response",
                            scene_beat: "The receptionist asks about breakfast.",
                            speaker_prompt: { speaker: "receptionist", text_vi: "Anh có muốn thêm bữa sáng không?", text_en: "Would you like to add breakfast?", emotion: "helpful" },
                            template_vi: "Có, tôi ____ bữa sáng.",
                            answer: "muốn",
                            choices: ["muốn", "là", "có", "ăn"]
                        },
                        {
                            id: "ch_03", type: "build_sentence",
                            scene_beat: "You want to ask about Wi-Fi.",
                            speaker_prompt: { speaker: "player", text_vi: "", text_en: "(Ask if there's Wi-Fi)", emotion: "curious" },
                            answer_tokens: ["Có", "Wi-Fi", "không"],
                            distractor_tokens: ["gì", "đâu"],
                            answer_en: "Is there Wi-Fi?"
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "The receptionist hands you the key card with a smile.",
                            speaker_prompt: { speaker: "receptionist", text_vi: "Đây là chìa khóa phòng 205. Chúc anh nghỉ ngơi vui vẻ!", text_en: "Here's the key for room 205. Have a pleasant stay!", emotion: "pleased" },
                            target_vi: "Cảm ơn chị nhiều!",
                            accept_variations: ["cảm ơn", "cảm ơn chị", "cảm ơn chị nhiều", "cam on", "cam on chi"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "receptionist", text_vi: "Dạ... anh nói lại nhé?", text_en: "Could you repeat that?", emotion: "helpful" },
                        { speaker: "receptionist", text_vi: "Em chưa hiểu ạ.", text_en: "I don't quite understand.", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "Chị Thảo upgrades you to a room with a city view. 'Anh nói tiếng Việt hay lắm!'", bonus_dong: 5 },
                        good: { scene_beat: "You're checked in! The room is cozy and the Wi-Fi password is on the key card.", bonus_dong: 2 },
                        retry: { scene_beat: "The receptionist switches to English to help. You'll check in fully in Vietnamese next time!", bonus_dong: 0 }
                    }
                }
            }
        ]
    },

    // ── Scene 8: At a Party (Unit 9) ──
    {
        id: "scene_party_001",
        lesson_id: "lesson_024",
        location_id: "loc_party",
        difficulty: "intermediate",
        title: "At a Party",
        title_vi: "Ở bữa tiệc",
        scene_type: "narrative",
        setting: { background_emoji: "🎉", background_css: "linear-gradient(135deg, #2d0a2d 0%, #4a1a4a 100%)" },
        characters: [
            { id: "newguy", name: "Anh Phúc", role: "New friend", emoji: "🧑", personality: "outgoing and curious" },
            { id: "friend", name: "Chị Lan", role: "Your friend", emoji: "👩", personality: "introduces everyone" },
            { id: "player", name: "You", role: "You", emoji: "🧑‍🎓" }
        ],
        vocab_items: ["it_w_0181", "it_w_0190", "it_w_0191"],
        grammar_card: { title: "Expressing Likes", structure: "Tôi thích + [noun/verb]", example: "Tôi thích nghe nhạc.", translation: "I like listening to music." },
        phases: [
            {
                type: "explore",
                config: {
                    instruction: "You're at a rooftop party. Tap conversation topics to learn the words.",
                    min_taps: 4,
                    show_grammar_card: true,
                    hotspots: [
                        { id: "hs_nhac", label: "Nghe nhạc", translation: "Listen to music", audio_key: "a_nghe_nhac", item_id: "it_w_0181", emoji: "🎵", price: "—", position: { row: 1, col: 1 } },
                        { id: "hs_phim", label: "Xem phim", translation: "Watch movies", audio_key: "a_xem_phim", item_id: "it_w_0190", emoji: "🎬", price: "—", position: { row: 1, col: 2 } },
                        { id: "hs_dulich", label: "Du lịch", translation: "Travel", audio_key: "a_du_lich", item_id: "it_w_0191", emoji: "✈️", price: "—", position: { row: 2, col: 1 } },
                        { id: "hs_naubep", label: "Nấu ăn", translation: "Cook", audio_key: "a_nau_an", item_id: "it_w_0181", emoji: "👨‍🍳", price: "—", position: { row: 2, col: 2 } },
                        { id: "hs_theduc", label: "Tập thể dục", translation: "Exercise", audio_key: "a_tap_the_duc", item_id: "it_w_0190", emoji: "💪", price: "—", position: { row: 3, col: 1 } },
                        { id: "hs_chuphinh", label: "Chụp hình", translation: "Take photos", audio_key: "a_chup_hinh", item_id: "it_w_0191", emoji: "📸", price: "—", position: { row: 3, col: 2 } }
                    ]
                }
            },
            {
                type: "observe",
                config: {
                    instruction: "Watch Lan introduce you to Phúc. Tap new words.",
                    script: [
                        { speaker: "friend", text_vi: "Phúc ơi, đây là bạn tôi! Bạn ấy đang học tiếng Việt.", text_en: "Phúc, this is my friend! They're learning Vietnamese.", hints: { "đây là": "this is", "đang": "currently", "học": "learn" }, emotion: "friendly" },
                        { speaker: "newguy", text_vi: "Ồ, hay quá! Bạn thích Việt Nam không?", text_en: "Oh, cool! Do you like Vietnam?", hints: { "hay": "cool/nice", "thích": "like" }, emotion: "curious" },
                        { speaker: "player", text_vi: "Tôi thích lắm! Đồ ăn ngon quá!", text_en: "I love it! The food is so good!", hints: { "lắm": "very", "ngon": "delicious" }, emotion: "confident" },
                        { speaker: "newguy", text_vi: "Bạn thích làm gì? Sở thích là gì?", text_en: "What do you like to do? What are your hobbies?", hints: { "sở thích": "hobbies", "làm gì": "do what" }, emotion: "curious" },
                        { speaker: "player", text_vi: "Tôi thích nghe nhạc và du lịch.", text_en: "I like listening to music and traveling.", hints: { "và": "and" }, emotion: "confident", grammar_highlight: "Tôi thích + [verb]" },
                        { speaker: "newguy", text_vi: "Tôi cũng thích du lịch! Bạn đã đi đâu rồi?", text_en: "I also like traveling! Where have you been?", hints: { "cũng": "also", "đã": "already" }, emotion: "pleased" }
                    ]
                }
            },
            {
                type: "perform",
                config: {
                    instruction: "Make conversation at the party!",
                    challenges: [
                        {
                            id: "ch_01", type: "dialogue_choice",
                            scene_beat: "Phúc asks about your hobbies. The music is playing in the background.",
                            speaker_prompt: { speaker: "newguy", text_vi: "Bạn thích làm gì?", text_en: "What do you like to do?", emotion: "curious" },
                            choices: [
                                { text_vi: "Tôi thích nghe nhạc và xem phim.", correct: true, response_vi: "Hay quá! Tôi cũng thích xem phim!", response_en: "Cool! I also like movies!", response_emotion: "pleased" },
                                { text_vi: "Tôi là du lịch.", correct: false, response_vi: "Bạn... là du lịch?", response_en: "You... are travel?", response_emotion: "confused" },
                                { text_vi: "Nghe nhạc.", correct: true, partial: true, tip: "Full sentence: 'Tôi thích nghe nhạc.'", response_vi: "Nhạc gì?", response_en: "What music?", response_emotion: "curious" }
                            ]
                        },
                        {
                            id: "ch_02", type: "build_sentence",
                            scene_beat: "Phúc asks if you like Vietnamese food.",
                            speaker_prompt: { speaker: "newguy", text_vi: "Bạn thích đồ ăn Việt Nam không?", text_en: "Do you like Vietnamese food?", emotion: "curious" },
                            answer_tokens: ["Tôi", "thích", "lắm"],
                            distractor_tokens: ["không", "là"],
                            answer_en: "I like it a lot!"
                        },
                        {
                            id: "ch_03", type: "fill_response",
                            scene_beat: "Phúc suggests meeting again tomorrow.",
                            speaker_prompt: { speaker: "newguy", text_vi: "Mai đi cà phê nhé?", text_en: "Coffee tomorrow?", emotion: "friendly" },
                            template_vi: "Được! Tôi ____ đi!",
                            answer: "muốn",
                            choices: ["muốn", "là", "có", "không"]
                        },
                        {
                            id: "ch_04", type: "free_speak",
                            scene_beat: "The party is winding down. Phúc gives you his number. Lan beams at you.",
                            speaker_prompt: { speaker: "newguy", text_vi: "Vui quá! Hẹn gặp lại nhé!", text_en: "So fun! See you again!", emotion: "pleased" },
                            target_vi: "Hẹn gặp lại!",
                            accept_variations: ["hẹn gặp lại", "hen gap lai", "tạm biệt", "tam biet", "bye"]
                        }
                    ],
                    wrong_answer_reactions: [
                        { speaker: "friend", text_vi: "Nói lại đi bạn...", text_en: "Try again...", emotion: "nervous" },
                        { speaker: "newguy", text_vi: "Hả? Sao?", text_en: "What? How?", emotion: "confused" }
                    ],
                    endings: {
                        perfect: { scene_beat: "Phúc invites you to karaoke next week. Lan whispers: 'Bạn giỏi lắm!' You made a real friend tonight.", bonus_dong: 5 },
                        good: { scene_beat: "Great conversation! Phúc teaches you some slang. A good start to your social life in Vietnam.", bonus_dong: 2 },
                        retry: { scene_beat: "Lan translates a bit. Phúc says your Vietnamese is 'dễ thương' (cute). You'll chat more next time!", bonus_dong: 0 }
                    }
                }
            }
        ]
    }
];
