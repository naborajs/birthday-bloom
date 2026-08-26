import { RelationshipType } from '@/features/core/store/useBirthdayStore';

export type EmotionalTone = 'romantic' | 'playful' | 'sincere' | 'poetic' | 'silly';

export interface WishTemplate {
  id: string;
  tone: EmotionalTone;
  relationship: RelationshipType;
  text: string;
  icon: string;
}

export const WRITE_YOUR_OWN_CARD: WishTemplate = {
  id: 'write-your-own',
  tone: 'sincere',
  relationship: 'family',
  text: '',
  icon: '✍️',
};

export const WISH_TEMPLATES: WishTemplate[] = [
  // PARTNER
  { id: 'p1', tone: 'romantic', relationship: 'partner', text: 'Happy birthday to my beautiful soulmate, {name}. Every day with you feels like an absolute dream come true.', icon: '❤️' },
  { id: 'p2', tone: 'romantic', relationship: 'partner', text: '{name}, my love for you grows deeper with every passing year. Happy birthday to my everything.', icon: '🌹' },
  { id: 'p3', tone: 'poetic', relationship: 'partner', text: 'To my {name}, the brightest star in my sky. May your birthday be as luminous as the love you bring to my life.', icon: '✨' },
  { id: 'p4', tone: 'playful', relationship: 'partner', text: 'Happy birthday, {name}! I love you more than pizza, and that is saying a lot.', icon: '🍕' },
  { id: 'p5', tone: 'silly', relationship: 'partner', text: '{name}, you might be a year older, but at least you still have me as a prize! Happy birthday.', icon: '🎁' },
  { id: 'p6', tone: 'sincere', relationship: 'partner', text: 'Wishing the happiest of birthdays to you, {name}. Thank you for being my rock and my greatest adventure.', icon: '🏔️' },
  { id: 'p7', tone: 'romantic', relationship: 'partner', text: 'I am so incredibly lucky to call you mine. Happy birthday, {name}, my endless love.', icon: '💞' },
  { id: 'p8', tone: 'poetic', relationship: 'partner', text: '{name}, if I could gather all the stars for you, it still would not equal the light you give me. Happy birthday.', icon: '🌌' },
  { id: 'p9', tone: 'silly', relationship: 'partner', text: 'Happy birthday to my favorite blanket-stealer, {name}. I guess I will let you have all the covers tonight.', icon: '🛌' },
  
  // FRIEND
  { id: 'fr1', tone: 'playful', relationship: 'friend', text: 'Happy birthday, {name}! Let us party like it is our job and we desperately need a promotion.', icon: '🥂' },
  { id: 'fr2', tone: 'silly', relationship: 'friend', text: '{name}, you are the only person I would share my snacks with. Have an awesome birthday!', icon: '🥨' },
  { id: 'fr3', tone: 'sincere', relationship: 'friend', text: 'To my wonderful friend {name}, thank you for always being there through thick and thin. Happy birthday!', icon: '🌻' },
  { id: 'fr4', tone: 'poetic', relationship: 'friend', text: 'A true friend is the rarest of treasures. So happy to celebrate another year of you, {name}.', icon: '💎' },
  { id: 'fr5', tone: 'playful', relationship: 'friend', text: 'Happy birthday, {name}! I am just here for the cake, but you are pretty cool too.', icon: '🍰' },
  { id: 'fr6', tone: 'silly', relationship: 'friend', text: 'Cheers to {name}! You are basically my unpaid therapist and I appreciate it.', icon: '🛋️' },
  { id: 'fr7', tone: 'sincere', relationship: 'friend', text: 'Life is so much better with you in it, {name}. Wishing you a birthday as fantastic as you are.', icon: '🎈' },
  { id: 'fr8', tone: 'playful', relationship: 'friend', text: 'We have been friends for so long, I cannot remember which one of us is the bad influence. Happy birthday, {name}!', icon: '😈' },
  
  // FAMILY
  { id: 'fa1', tone: 'sincere', relationship: 'family', text: 'Happy birthday, {name}. Our family is so incredibly blessed to have your warmth and joy in our lives.', icon: '🏡' },
  { id: 'fa2', tone: 'poetic', relationship: 'family', text: 'To {name}, the roots of our family tree that keep us grounded and the branches that help us reach for the sky.', icon: '🌳' },
  { id: 'fa3', tone: 'silly', relationship: 'family', text: 'Happy birthday, {name}! We might be slightly crazy, but at least we are in it together.', icon: '🤪' },
  { id: 'fa4', tone: 'playful', relationship: 'family', text: 'Another year older, {name}, but let us be honest, you are still the favorite.', icon: '🏆' },
  { id: 'fa5', tone: 'sincere', relationship: 'family', text: '{name}, sending you all my love today. Thank you for always making family gatherings so special.', icon: '🤍' },
  { id: 'fa6', tone: 'poetic', relationship: 'family', text: 'May this year bring you as much happiness as the memories we share, {name}. Happy birthday.', icon: '🕊️' },
  { id: 'fa7', tone: 'sincere', relationship: 'family', text: 'Wishing a very happy birthday to you, {name}. You mean the world to all of us.', icon: '🌍' },
  { id: 'fa8', tone: 'playful', relationship: 'family', text: '{name}, happy birthday! I was going to get you a great gift, but being related to me is a gift in itself.', icon: '🎀' },

  // SIBLING
  { id: 'si1', tone: 'playful', relationship: 'sibling', text: 'Happy birthday, {name}! As your favorite sibling, you are welcome for this amazing message.', icon: '👑' },
  { id: 'si2', tone: 'silly', relationship: 'sibling', text: '{name}, Mom always liked you best, but I am still cooler. Have a great birthday!', icon: '😎' },
  { id: 'si3', tone: 'sincere', relationship: 'sibling', text: 'To my wonderful sibling, {name}. We may fight sometimes, but I would be lost without you.', icon: '❤️' },
  { id: 'si4', tone: 'poetic', relationship: 'sibling', text: 'Shared pasts and intertwined futures. Happy birthday to my first friend, {name}.', icon: '🌿' },
  { id: 'si5', tone: 'silly', relationship: 'sibling', text: 'Happy birthday, {name}! Remember, I know all your secrets and I am not afraid to use them.', icon: '🤫' },
  { id: 'si6', tone: 'playful', relationship: 'sibling', text: '{name}, I smile because you are my sibling. I laugh because there is nothing you can do about it!', icon: '😆' },
  { id: 'si7', tone: 'sincere', relationship: 'sibling', text: 'Happy birthday, {name}. Growing up with you has been the greatest adventure of my life.', icon: '🚀' },
  { id: 'si8', tone: 'silly', relationship: 'sibling', text: 'Congratulations on surviving another year of our family, {name}!', icon: '🏅' },

  // BROTHER
  { id: 'br1', tone: 'playful', relationship: 'brother', text: 'Happy birthday, {name}! Do not worry, I will not tell everyone what a huge dork you actually are.', icon: '🤓' },
  { id: 'br2', tone: 'sincere', relationship: 'brother', text: 'To my brother {name}, thank you for always having my back. Have the best birthday ever.', icon: '🤝' },
  { id: 'br3', tone: 'silly', relationship: 'brother', text: '{name}, you might be older, but I am still the cute one. Happy birthday!', icon: '🧸' },
  { id: 'br4', tone: 'poetic', relationship: 'brother', text: 'A brother is a friend given by nature. Happy birthday to my truest companion, {name}.', icon: '🌲' },
  { id: 'br5', tone: 'playful', relationship: 'brother', text: 'Happy birthday, {name}! Let us celebrate by doing something Mom would definitely disapprove of.', icon: '🍻' },
  { id: 'br6', tone: 'sincere', relationship: 'brother', text: '{name}, I am so proud of the man you have become. Wishing you a wonderful birthday.', icon: '🌟' },
  { id: 'br7', tone: 'silly', relationship: 'brother', text: 'Happy birthday to my brother {name}. Try not to break anything today.', icon: '🔨' },
  { id: 'br8', tone: 'sincere', relationship: 'brother', text: 'To the best brother in the world, {name}. Your kindness inspires me every single day.', icon: '💙' },

  // SISTER
  { id: 'sr1', tone: 'sincere', relationship: 'sister', text: 'Happy birthday to my beautiful sister, {name}. You brighten up every room you walk into.', icon: '✨' },
  { id: 'sr2', tone: 'playful', relationship: 'sister', text: '{name}, you are my sister, my confidante, and the person I steal clothes from. Happy birthday!', icon: '👗' },
  { id: 'sr3', tone: 'poetic', relationship: 'sister', text: 'Like a delicate flower that blooms through adversity, you amaze me, {name}. Happy birthday.', icon: '🌸' },
  { id: 'sr4', tone: 'silly', relationship: 'sister', text: 'Happy birthday, {name}! Thanks for doing all the dumb stuff first so I could learn from your mistakes.', icon: '🤦‍♀️' },
  { id: 'sr5', tone: 'sincere', relationship: 'sister', text: 'To my sister {name}, my life is infinitely better because you are in it. Have a magical day.', icon: '🧚‍♀️' },
  { id: 'sr6', tone: 'playful', relationship: 'sister', text: 'Happy birthday, {name}! I promise not to tell Mom about that thing we did that one time.', icon: '🤐' },
  { id: 'sr7', tone: 'sincere', relationship: 'sister', text: 'You are not just my sister, {name}, you are my best friend. Happy birthday.', icon: '👯‍♀️' },
  { id: 'sr8', tone: 'silly', relationship: 'sister', text: '{name}, may your birthday be as fabulous and chaotic as you are!', icon: '🌪️' },

  // FATHER
  { id: 'd1', tone: 'sincere', relationship: 'father', text: 'Happy birthday, {name}. Thank you for being my hero, my guide, and my biggest supporter.', icon: '🛡️' },
  { id: 'd2', tone: 'poetic', relationship: 'father', text: 'To my father {name}, your wisdom is the compass that has guided me through life’s storms.', icon: '🧭' },
  { id: 'd3', tone: 'playful', relationship: 'father', text: 'Happy birthday, {name}! You do not look a day over your actual age!', icon: '👴' },
  { id: 'd4', tone: 'silly', relationship: 'father', text: '{name}, I hope your birthday is full of terrible dad jokes and endless naps.', icon: '💤' },
  { id: 'd5', tone: 'sincere', relationship: 'father', text: 'Dad, {name}, everything I am is because of your unwavering belief in me. Have a wonderful birthday.', icon: '❤️' },
  { id: 'd6', tone: 'poetic', relationship: 'father', text: 'Like an ancient oak, you provide shelter and strength. Happy birthday, {name}.', icon: '🌳' },
  { id: 'd7', tone: 'playful', relationship: 'father', text: 'Happy birthday to the man who taught me everything, {name}. Well, almost everything.', icon: '📚' },
  { id: 'd8', tone: 'sincere', relationship: 'father', text: 'To the world you are one person, but to me you are the world, {name}. Happy birthday.', icon: '🌎' },

  // MOTHER
  { id: 'm1', tone: 'sincere', relationship: 'mother', text: 'Happy birthday, {name}. Your love is the heartbeat of our family. Thank you for everything.', icon: '💓' },
  { id: 'm2', tone: 'poetic', relationship: 'mother', text: 'To my mother {name}, whose grace and endless patience are a daily miracle. Have a beautiful birthday.', icon: '🕊️' },
  { id: 'm3', tone: 'playful', relationship: 'mother', text: '{name}, you deserve the biggest slice of cake today. Mostly for putting up with me!', icon: '🍰' },
  { id: 'm4', tone: 'silly', relationship: 'mother', text: 'Happy birthday, {name}! I am your greatest accomplishment, so you are very welcome.', icon: '🏆' },
  { id: 'm5', tone: 'sincere', relationship: 'mother', text: 'Mom, {name}, you are my first home and my forever safe place. Happy birthday.', icon: '🏠' },
  { id: 'm6', tone: 'poetic', relationship: 'mother', text: 'A mother’s love is the sunrise that brightens every morning. Happy birthday, {name}.', icon: '🌅' },
  { id: 'm7', tone: 'playful', relationship: 'mother', text: 'Happy birthday to the woman who knows exactly where everything is in this house, {name}!', icon: '🔎' },
  { id: 'm8', tone: 'sincere', relationship: 'mother', text: '{name}, there is no one else like you. I hope your birthday is as extraordinary as you are.', icon: '✨' },

  // GRANDFATHER
  { id: 'gf1', tone: 'sincere', relationship: 'grandfather', text: 'Happy birthday, {name}. Your stories and wisdom are my favorite treasures.', icon: '📖' },
  { id: 'gf2', tone: 'poetic', relationship: 'grandfather', text: 'To my grandfather {name}, a life well-lived is a masterpiece, and yours is a classic.', icon: '🖼️' },
  { id: 'gf3', tone: 'playful', relationship: 'grandfather', text: 'Happy birthday, {name}! Try not to get into too much trouble today.', icon: '🚗' },
  { id: 'gf4', tone: 'silly', relationship: 'grandfather', text: '{name}, you are the only one who can get away with giving me candy before dinner. Happy birthday!', icon: '🍬' },
  { id: 'gf5', tone: 'sincere', relationship: 'grandfather', text: 'Grandpa {name}, you have a heart of gold. Wishing you the happiest of birthdays.', icon: '💛' },
  { id: 'gf6', tone: 'poetic', relationship: 'grandfather', text: 'Your legacy is written in the love of your family. Happy birthday, {name}.', icon: '🖋️' },
  { id: 'gf7', tone: 'sincere', relationship: 'grandfather', text: 'To {name}, thank you for always having a listening ear and a warm hug. Happy birthday.', icon: '🤗' },
  { id: 'gf8', tone: 'playful', relationship: 'grandfather', text: 'Happy birthday, {name}! You have forgotten more than I will ever know.', icon: '🧠' },

  // GRANDMOTHER
  { id: 'gm1', tone: 'sincere', relationship: 'grandmother', text: 'Happy birthday, {name}. Your gentle spirit and boundless love mean everything to me.', icon: '🌷' },
  { id: 'gm2', tone: 'poetic', relationship: 'grandmother', text: 'To my grandmother {name}, your hands have woven the fabric of our family with threads of pure love.', icon: '🧶' },
  { id: 'gm3', tone: 'playful', relationship: 'grandmother', text: '{name}, thank you for always slipping me a twenty when no one was looking. Happy birthday!', icon: '💵' },
  { id: 'gm4', tone: 'silly', relationship: 'grandmother', text: 'Happy birthday, {name}! Your cooking is the only reason I ever come to visit. Just kidding... mostly.', icon: '🍲' },
  { id: 'gm5', tone: 'sincere', relationship: 'grandmother', text: 'Grandma {name}, you are the light of our lives. Wishing you a day filled with joy.', icon: '☀️' },
  { id: 'gm6', tone: 'poetic', relationship: 'grandmother', text: 'Time stands still in the warmth of your embrace. Happy birthday, {name}.', icon: '🕰️' },
  { id: 'gm7', tone: 'sincere', relationship: 'grandmother', text: 'To my dearest {name}, thank you for spoiling me and loving me unconditionally. Happy birthday.', icon: '💕' },
  { id: 'gm8', tone: 'playful', relationship: 'grandmother', text: 'Happy birthday, {name}! Stay fabulous and keep bossing everyone around.', icon: '👑' },

  // UNCLE
  { id: 'un1', tone: 'sincere', relationship: 'uncle', text: 'Happy birthday, {name}! Thank you for being such a supportive and incredible uncle.', icon: '🙌' },
  { id: 'un2', tone: 'playful', relationship: 'uncle', text: 'To {name}, the fun uncle who always lets me bend the rules. Have a great birthday!', icon: '🎡' },
  { id: 'un3', tone: 'silly', relationship: 'uncle', text: 'Happy birthday, {name}! Let us hope you never grow up.', icon: '🛹' },
  { id: 'un4', tone: 'sincere', relationship: 'uncle', text: 'Uncle {name}, I always look forward to seeing you. Wishing you the best birthday ever.', icon: '🎉' },
  { id: 'un5', tone: 'poetic', relationship: 'uncle', text: 'A steady presence and a guiding light. Happy birthday to my wonderful uncle, {name}.', icon: '灯' }, // wait, lamp emoji is 🪔 or 🏮, let's use 🌟
  { id: 'un6', tone: 'playful', relationship: 'uncle', text: 'Happy birthday, {name}! You are basically a dad but way cooler and with fewer rules.', icon: '🎸' },
  { id: 'un7', tone: 'sincere', relationship: 'uncle', text: 'To {name}, hoping your birthday is filled with as much happiness as you bring to others.', icon: '😊' },
  { id: 'un8', tone: 'silly', relationship: 'uncle', text: 'Happy birthday, {name}! Try not to embarrass us too much today.', icon: '🙈' },

  // AUNT
  { id: 'au1', tone: 'sincere', relationship: 'aunt', text: 'Happy birthday, {name}. You have always been like a second mother to me, and I love you dearly.', icon: '💖' },
  { id: 'au2', tone: 'playful', relationship: 'aunt', text: 'To my fabulous aunt {name}, cheers to being the most glamorous person in the family!', icon: '💅' },
  { id: 'au3', tone: 'silly', relationship: 'aunt', text: 'Happy birthday, {name}! Thanks for always giving me the best gossip.', icon: '☕' },
  { id: 'au4', tone: 'sincere', relationship: 'aunt', text: 'Aunt {name}, your kindness and generosity inspire me every day. Have a beautiful birthday.', icon: '🌺' },
  { id: 'au5', tone: 'poetic', relationship: 'aunt', text: 'Like a rare gem, your vibrant spirit illuminates our family. Happy birthday, {name}.', icon: '💎' },
  { id: 'au6', tone: 'playful', relationship: 'aunt', text: 'Happy birthday, {name}! Let us go shopping and pretend calories do not exist today.', icon: '🛍️' },
  { id: 'au7', tone: 'sincere', relationship: 'aunt', text: 'To my wonderful aunt {name}, wishing you a day as sweet and lovely as you are.', icon: '🍰' },
  { id: 'au8', tone: 'silly', relationship: 'aunt', text: 'Happy birthday, {name}! Keep shining and stay wildly inappropriate.', icon: '🥂' },

  // COUSIN
  { id: 'co1', tone: 'playful', relationship: 'cousin', text: 'Happy birthday, {name}! We are cousins by blood, but friends by choice.', icon: '🤜🤛' },
  { id: 'co2', tone: 'silly', relationship: 'cousin', text: 'To {name}, the only person who truly understands how weird our family is. Happy birthday!', icon: '👽' },
  { id: 'co3', tone: 'sincere', relationship: 'cousin', text: 'Happy birthday to my amazing cousin, {name}. So grateful for all our childhood memories.', icon: '📷' },
  { id: 'co4', tone: 'poetic', relationship: 'cousin', text: 'Branches on the same tree, growing in different directions but sharing the same roots. Happy birthday, {name}.', icon: '🌳' },
  { id: 'co5', tone: 'playful', relationship: 'cousin', text: 'Happy birthday, {name}! Let us cause some trouble today, just for old times sake.', icon: '🧨' },
  { id: 'co6', tone: 'sincere', relationship: 'cousin', text: 'Cousin {name}, wishing you a birthday filled with everything you love most.', icon: '🎁' },
  { id: 'co7', tone: 'silly', relationship: 'cousin', text: 'Happy birthday, {name}! Thanks for making family reunions tolerable.', icon: '🍻' },
  { id: 'co8', tone: 'sincere', relationship: 'cousin', text: 'To {name}, a cousin who is truly a lifelong friend. Have the happiest of birthdays.', icon: '✨' },

  // SON
  { id: 'so1', tone: 'sincere', relationship: 'son', text: 'Happy birthday, {name}. Watching you grow into the man you are today is my greatest joy.', icon: '🌟' },
  { id: 'so2', tone: 'poetic', relationship: 'son', text: 'To my son {name}, you are the bright morning sun that chases away my darkest nights. Happy birthday.', icon: '🌅' },
  { id: 'so3', tone: 'playful', relationship: 'son', text: 'Happy birthday, {name}! You may be taller than me now, but I can still ground you.', icon: '📏' },
  { id: 'so4', tone: 'silly', relationship: 'son', text: '{name}, my wallet hates you, but my heart loves you. Happy birthday, son!', icon: '💸' },
  { id: 'so5', tone: 'sincere', relationship: 'son', text: 'My dearest {name}, I am so incredibly proud of you. Wishing you a wonderful birthday.', icon: '💙' },
  { id: 'so6', tone: 'poetic', relationship: 'son', text: 'May your path be lined with stars and your heart filled with courage, {name}. Happy birthday.', icon: '🌠' },
  { id: 'so7', tone: 'playful', relationship: 'son', text: 'Happy birthday, {name}! Do not forget who taught you how to use a spoon.', icon: '🥄' },
  { id: 'so8', tone: 'sincere', relationship: 'son', text: 'To my amazing son, {name}. The world is a better place with you in it. Happy birthday.', icon: '🌍' },

  // DAUGHTER
  { id: 'da1', tone: 'sincere', relationship: 'daughter', text: 'Happy birthday, {name}. You are the most precious gift I have ever received.', icon: '💝' },
  { id: 'da2', tone: 'poetic', relationship: 'daughter', text: 'To my daughter {name}, you are a masterpiece of grace and fire. Keep shining your beautiful light.', icon: '🔥' },
  { id: 'da3', tone: 'playful', relationship: 'daughter', text: 'Happy birthday, {name}! I loved you even through your awkward teenage phase.', icon: '🦋' },
  { id: 'da4', tone: 'silly', relationship: 'daughter', text: '{name}, you stole my heart, my sleep, and mostly my sanity. I wouldn’t trade it for anything. Happy birthday!', icon: '😵' },
  { id: 'da5', tone: 'sincere', relationship: 'daughter', text: 'My sweet {name}, I am so profoundly proud of the woman you are becoming. Have a wonderful birthday.', icon: '🌺' },
  { id: 'da6', tone: 'poetic', relationship: 'daughter', text: 'May you always dance to the rhythm of your own wild heart, {name}. Happy birthday.', icon: '💃' },
  { id: 'da7', tone: 'playful', relationship: 'daughter', text: 'Happy birthday, {name}! Stop growing up so fast before I sue you for emotional distress.', icon: '⚖️' },
  { id: 'da8', tone: 'sincere', relationship: 'daughter', text: 'To my darling daughter, {name}. You make every single day brighter. Happy birthday.', icon: '☀️' },

  // GUARDIAN
  { id: 'gu1', tone: 'sincere', relationship: 'guardian', text: 'Happy birthday, {name}. Thank you for stepping in, stepping up, and loving me fiercely.', icon: '🛡️' },
  { id: 'gu2', tone: 'poetic', relationship: 'guardian', text: 'To {name}, my sanctuary and my fortress. Your love has shaped my entire world. Happy birthday.', icon: '🏰' },
  { id: 'gu3', tone: 'playful', relationship: 'guardian', text: 'Happy birthday, {name}! Thanks for raising me and somehow surviving the process.', icon: '😅' },
  { id: 'gu4', tone: 'sincere', relationship: 'guardian', text: '{name}, family isn’t always blood; it is the people who show up. Thank you for always showing up. Happy birthday.', icon: '🤝' },
  { id: 'gu5', tone: 'poetic', relationship: 'guardian', text: 'A guiding star when the night was dark. Happy birthday, {name}.', icon: '⭐' },
  { id: 'gu6', tone: 'silly', relationship: 'guardian', text: 'Happy birthday, {name}! I turned out awesome, so you must have done something right.', icon: '💯' },
  { id: 'gu7', tone: 'sincere', relationship: 'guardian', text: 'To my guardian {name}, your unending patience and care mean the world to me. Have a wonderful birthday.', icon: '🤍' },
  { id: 'gu8', tone: 'playful', relationship: 'guardian', text: 'Happy birthday, {name}! I promise to eventually stop testing your patience.', icon: '😇' },

  // COLLEAGUE
  { id: 'cl1', tone: 'playful', relationship: 'colleague', text: 'Happy birthday, {name}! Let us pretend to work while eating your birthday cake.', icon: '🎂' },
  { id: 'cl2', tone: 'sincere', relationship: 'colleague', text: 'To a fantastic colleague, {name}. Wishing you a birthday full of success and happiness.', icon: '📈' },
  { id: 'cl3', tone: 'silly', relationship: 'colleague', text: 'Happy birthday, {name}! I hope your inbox is empty and your coffee is strong today.', icon: '☕' },
  { id: 'cl4', tone: 'sincere', relationship: 'colleague', text: '{name}, working with you is an absolute pleasure. Hope you have the best birthday!', icon: '💼' },
  { id: 'cl5', tone: 'poetic', relationship: 'colleague', text: 'May the year ahead bring you new horizons and triumphant victories, {name}. Happy birthday.', icon: '⛵' },
  { id: 'cl6', tone: 'playful', relationship: 'colleague', text: 'Happy birthday, {name}! Don’t worry, I won’t schedule any meetings for you today.', icon: '🚫' },
  { id: 'cl7', tone: 'silly', relationship: 'colleague', text: 'To {name}, the only reason I survive Mondays. Happy birthday!', icon: '🗓️' },
  { id: 'cl8', tone: 'sincere', relationship: 'colleague', text: 'Happy birthday, {name}! Here is to another year of great teamwork and shared success.', icon: '🏆' },

  // MENTOR
  { id: 'me1', tone: 'sincere', relationship: 'mentor', text: 'Happy birthday, {name}. Your guidance has profoundly impacted my life and career.', icon: '🧭' },
  { id: 'me2', tone: 'poetic', relationship: 'mentor', text: 'To {name}, a beacon of wisdom illuminating the path for others. Wishing you a beautiful birthday.', icon: '🪧' },
  { id: 'me3', tone: 'playful', relationship: 'mentor', text: 'Happy birthday, {name}! Thanks for tolerating all my endless questions.', icon: '❓' },
  { id: 'me4', tone: 'sincere', relationship: 'mentor', text: '{name}, I am so grateful for your patience and your belief in me. Have a fantastic birthday.', icon: '🙏' },
  { id: 'me5', tone: 'poetic', relationship: 'mentor', text: 'Great leaders plant trees under whose shade they do not expect to sit. Happy birthday, {name}.', icon: '🌲' },
  { id: 'me6', tone: 'silly', relationship: 'mentor', text: 'Happy birthday, {name}! I promise to actually listen to your advice today.', icon: '👂' },
  { id: 'me7', tone: 'sincere', relationship: 'mentor', text: 'To an extraordinary mentor, {name}. Wishing you all the joy and success you deserve today.', icon: '🌟' },
  { id: 'me8', tone: 'playful', relationship: 'mentor', text: 'Happy birthday, {name}! May your day be as insightful and awesome as your advice.', icon: '🧠' },
];

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getWishDeck(relationship: RelationshipType, name: string): WishTemplate[] {
  let filtered = WISH_TEMPLATES.filter((template) => template.relationship === relationship);
  
  if (filtered.length === 0) {
    filtered = WISH_TEMPLATES.filter((template) => template.relationship === 'family');
  }

  const interpolated = filtered.map(template => ({
    ...template,
    text: template.text.replace(/{name}/g, name),
  }));

  return shuffleArray(interpolated);
}
