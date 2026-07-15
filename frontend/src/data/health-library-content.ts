// Health Library article content
// General patient-education content only — not a substitute for professional medical advice.

export interface ArticleSection {
  heading: string
  body: string[] // paragraphs
  list?: string[] // optional bullet list under the section
}

export interface ArticleContent {
  slug: string
  sections: ArticleSection[]
}

export const ARTICLE_CONTENT: Record<string, ArticleContent> = {
  'Common Cold': {
    slug: 'common-cold',
    sections: [
      {
        heading: 'Overview',
        body: [
          'The common cold is a mild viral infection of the nose and throat (upper respiratory tract). It is one of the most frequent reasons people feel unwell, and most adults get two to three colds a year. Colds are usually harmless and clear up on their own within 7–10 days.',
        ],
      },
      {
        heading: 'Common Symptoms',
        body: ['Symptoms usually appear gradually, one to three days after exposure to the virus, and may include:'],
        list: [
          'Runny or blocked nose',
          'Sneezing',
          'Sore or scratchy throat',
          'Mild cough',
          'Slight body aches or a mild headache',
          'Low-grade fever (more common in children)',
          'General feeling of tiredness',
        ],
      },
      {
        heading: 'Causes',
        body: [
          'Colds are caused by viruses — most often rhinoviruses — that spread through droplets in the air when an infected person coughs or sneezes, or through contact with contaminated surfaces followed by touching the eyes, nose, or mouth.',
        ],
      },
      {
        heading: 'Home Care',
        body: ['Most colds can be managed comfortably at home while your immune system clears the virus:'],
        list: [
          'Rest and get enough sleep',
          'Drink plenty of fluids — water, warm soups, and herbal teas help loosen mucus and prevent dehydration',
          'Use saline nasal drops or sprays to ease congestion',
          'Gargle warm salt water for a sore throat',
          'Paracetamol can help with aches, headache, or mild fever if needed',
        ],
      },
      {
        heading: 'When to See a Doctor',
        body: ['A regular cold does not usually need medical attention, but see a doctor if you notice:'],
        list: [
          'Fever above 38.5°C lasting more than three days',
          'Symptoms lasting longer than 10 days without improvement',
          'Difficulty breathing or chest pain',
          'Severe sore throat, ear pain, or sinus pain',
          'Symptoms in an infant under 3 months, or a child who is unusually lethargic',
        ],
      },
      {
        heading: 'Prevention',
        body: ['You can lower your risk of catching or spreading a cold by:'],
        list: [
          'Washing your hands often with soap and water',
          'Avoiding close contact with people who are sick',
          'Not touching your face with unwashed hands',
          'Covering your mouth and nose when you cough or sneeze',
        ],
      },
    ],
  },

  'Flu (Influenza)': {
    slug: 'flu-influenza',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Influenza (the flu) is a contagious respiratory illness caused by influenza viruses. Unlike the common cold, flu symptoms tend to come on suddenly and are usually more severe, affecting the whole body rather than just the nose and throat.',
        ],
      },
      {
        heading: 'Common Symptoms',
        body: ['Flu symptoms typically start abruptly and can include:'],
        list: [
          'Sudden high fever (38–40°C)',
          'Chills and sweating',
          'Muscle or body aches',
          'Fatigue and weakness that can last for weeks',
          'Dry cough',
          'Headache',
          'Sore throat and nasal congestion',
        ],
      },
      {
        heading: 'Causes',
        body: [
          'The flu is caused by influenza A or B viruses, which spread mainly through respiratory droplets when infected people cough, sneeze, or talk, and through contact with contaminated surfaces.',
        ],
      },
      {
        heading: 'Home Care',
        body: ['Most healthy people recover from flu at home within one to two weeks:'],
        list: [
          'Get plenty of rest and avoid strenuous activity',
          'Stay well hydrated',
          'Use paracetamol to help control fever and body aches',
          'Stay away from others to avoid spreading the virus, especially in the first few days',
          'Use a humidifier or warm shower steam to ease congestion and cough',
        ],
      },
      {
        heading: 'When to See a Doctor',
        body: ['Seek prompt medical care if you or someone you are caring for has:'],
        list: [
          'Difficulty breathing or shortness of breath',
          'Persistent chest or abdominal pain or pressure',
          'Sudden dizziness or confusion',
          'Severe or persistent vomiting',
          'Symptoms that improve then return with fever and worse cough',
          'Underlying conditions such as asthma, heart disease, diabetes, or pregnancy, as flu can be more serious in these groups',
        ],
      },
      {
        heading: 'Prevention',
        body: ['The best protection against flu includes:'],
        list: [
          'Getting an annual flu vaccination, especially for high-risk groups',
          'Washing hands frequently',
          'Avoiding close contact with sick individuals',
          'Staying home when unwell to protect others',
        ],
      },
    ],
  },

  'Fever': {
    slug: 'fever',
    sections: [
      {
        heading: 'Overview',
        body: [
          'A fever is a temporary rise in body temperature, usually a sign that the body is fighting an infection. A normal body temperature is around 37°C; a temperature of 38°C or above is generally considered a fever.',
        ],
      },
      {
        heading: 'Common Causes',
        body: ['Fever is a symptom, not a disease itself. Common causes include:'],
        list: [
          'Viral infections (colds, flu)',
          'Bacterial infections (such as malaria, typhoid, or urinary tract infections)',
          'Inflammatory conditions',
          'Reactions to vaccines',
          'Heat exhaustion',
        ],
      },
      {
        heading: 'Recognizing a Fever',
        body: ['Along with a raised temperature, you may notice:'],
        list: [
          'Sweating or chills and shivering',
          'Headache',
          'Muscle aches',
          'Loss of appetite',
          'General weakness or irritability',
        ],
      },
      {
        heading: 'Home Care',
        body: ['Mild fevers in otherwise healthy people can usually be managed at home:'],
        list: [
          'Rest and drink plenty of fluids to prevent dehydration',
          'Dress in lightweight clothing and keep the room comfortably cool',
          'Paracetamol or ibuprofen can help lower fever and ease discomfort — follow dosing instructions carefully',
          'Use a lukewarm sponge bath if the fever feels uncomfortable — avoid cold water or ice, which can cause shivering',
        ],
      },
      {
        heading: 'When to See a Doctor',
        body: ['Seek medical attention if:'],
        list: [
          'Fever is above 39.5°C, or lasts more than three days',
          'Fever is accompanied by a stiff neck, severe headache, rash, difficulty breathing, or persistent vomiting',
          'A child under 3 months has any fever',
          'Fever occurs after travel to a malaria-endemic area',
          'The person becomes confused, unusually drowsy, or has a seizure',
        ],
      },
      {
        heading: 'Prevention',
        body: [
          'Since fever is usually caused by an underlying infection, reducing your risk of infection — through hand hygiene, safe food and water practices, vaccination, and mosquito-bite prevention — helps prevent many of the illnesses that cause fever.',
        ],
      },
    ],
  },

  'Headache': {
    slug: 'headache',
    sections: [
      {
        heading: 'Overview',
        body: [
          'A headache is pain or discomfort in the head, scalp, or neck. Most headaches are not serious and can be managed with rest, hydration, and over-the-counter pain relief, but some types need closer attention.',
        ],
      },
      {
        heading: 'Common Types',
        body: ['Headaches are often grouped by type:'],
        list: [
          'Tension headache — a dull, pressing pain often felt like a tight band around the head, commonly linked to stress or poor posture',
          'Migraine — throbbing pain, often on one side, sometimes with nausea and sensitivity to light or sound',
          'Sinus headache — pain and pressure around the eyes, cheeks, and forehead, often with nasal congestion',
          'Dehydration or hunger headache — brought on by missed meals or insufficient fluid intake',
        ],
      },
      {
        heading: 'Common Causes',
        body: ['Headaches can be triggered by:'],
        list: [
          'Stress, anxiety, or lack of sleep',
          'Dehydration or skipped meals',
          'Eye strain or poor posture',
          'Caffeine withdrawal',
          'Colds, flu, sinus infections, or fever',
          'Certain foods, alcohol, or strong smells',
        ],
      },
      {
        heading: 'Home Care',
        body: ['Most headaches respond well to simple self-care:'],
        list: [
          'Rest in a quiet, dark room',
          'Drink water — dehydration is a common trigger',
          'Apply a cool or warm compress to the head or neck',
          'Take paracetamol or ibuprofen as directed',
          'Practice relaxation techniques if stress is a trigger',
        ],
      },
      {
        heading: 'When to See a Doctor',
        body: ['Seek urgent medical care for a headache that is:'],
        list: [
          'Sudden and extremely severe ("the worst headache of your life")',
          'Accompanied by confusion, slurred speech, weakness, or vision changes',
          'Following a head injury',
          'Accompanied by a stiff neck, rash, and fever',
          'Worsening steadily over days, or waking you from sleep',
          'Occurring frequently and interfering with daily life',
        ],
      },
      {
        heading: 'Prevention',
        body: ['Reduce recurring headaches by maintaining regular sleep and meal times, staying hydrated, managing stress, limiting caffeine and alcohol, and taking regular screen breaks.'],
      },
    ],
  },

  'Vaccinations': {
    slug: 'vaccinations',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Vaccines help your immune system recognize and fight specific infections before you ever encounter them naturally. They are one of the most effective tools in preventing serious and life-threatening diseases, for both individuals and communities.',
        ],
      },
      {
        heading: 'How Vaccines Work',
        body: [
          'A vaccine contains a weakened, inactivated, or partial form of a germ (or instructions to build a harmless piece of it). This trains your immune system to recognize the real infection and respond quickly if you are exposed later, often preventing illness entirely or making it much milder.',
        ],
      },
      {
        heading: 'Common Recommended Vaccines',
        body: ['Depending on age and health status, commonly recommended vaccines include:'],
        list: [
          'Childhood immunizations — BCG, polio, measles, DPT (diphtheria, pertussis, tetanus), hepatitis B',
          'Yellow fever vaccine — required in many parts of Nigeria and for travel',
          'Tetanus boosters — especially after injuries',
          'Annual influenza (flu) vaccine',
          'HPV vaccine for adolescents',
          'COVID-19 vaccination and boosters where recommended',
        ],
      },
      {
        heading: 'Possible Side Effects',
        body: ['Most side effects are mild and temporary, such as:'],
        list: [
          'Soreness, redness, or swelling at the injection site',
          'Mild fever',
          'Tiredness or headache',
        ],
      },
      {
        heading: 'When to Seek Care',
        body: ['Contact a healthcare provider if, after vaccination, you experience difficulty breathing, facial or throat swelling, a fast heartbeat, dizziness, or a widespread rash — these are rare but require urgent attention.'],
      },
      {
        heading: 'Staying on Schedule',
        body: [
          'Keep an up-to-date immunization card for yourself and your children, and follow the schedule recommended by your healthcare provider or national immunization program. If you miss a dose, it is usually safe to catch up rather than restart the series — ask your provider for guidance.',
        ],
      },
    ],
  },

  'Nutrition Basics': {
    slug: 'nutrition-basics',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Good nutrition gives your body the energy and nutrients it needs to function, fight illness, and stay strong. Eating a varied, balanced diet is one of the simplest and most powerful things you can do for your long-term health.',
        ],
      },
      {
        heading: 'The Building Blocks of a Balanced Diet',
        body: ['A healthy plate generally includes a mix of:'],
        list: [
          'Carbohydrates — whole grains, rice, yam, and other starchy staples for energy',
          'Protein — beans, fish, eggs, poultry, meat, or lentils for growth and repair',
          'Fruits and vegetables — aim for a variety of colors for vitamins, minerals, and fiber',
          "Healthy fats — nuts, seeds, avocado, and vegetable oils in moderation",
          "Water — the body's most essential nutrient",
        ],
      },
      {
        heading: 'Simple Daily Habits',
        body: ['Small, consistent choices add up:'],
        list: [
          'Fill half your plate with vegetables and fruit where possible',
          'Choose whole grains over refined ones when you can',
          'Limit added sugar, salt, and highly processed foods',
          'Drink water instead of sugary drinks',
          'Eat regular meals rather than skipping them',
        ],
      },
      {
        heading: 'Special Considerations',
        body: [
          'Nutritional needs vary by age, activity level, pregnancy, and existing health conditions such as diabetes or hypertension. People with chronic conditions should follow dietary guidance from their healthcare provider or a registered dietitian.',
        ],
      },
      {
        heading: 'When to Seek Guidance',
        body: ['Speak with a healthcare provider if you experience unexplained weight loss or gain, persistent fatigue, digestive problems, or if you are managing a condition that requires a specialized diet.'],
      },
    ],
  },

  'Healthy Habits': {
    slug: 'healthy-habits',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Small, consistent daily habits have a bigger long-term impact on health than occasional big efforts. Building a few sustainable routines can lower your risk of chronic disease and improve how you feel day to day.',
        ],
      },
      {
        heading: 'Core Habits for a Healthier Life',
        body: ['Consider building these habits into your routine:'],
        list: [
          'Move your body — aim for at least 30 minutes of activity most days, such as brisk walking',
          'Sleep well — most adults need 7–9 hours of quality sleep a night',
          'Stay hydrated — drink water regularly throughout the day',
          'Eat mindfully — favor whole foods and balanced meals over processed snacks',
          'Manage stress — take breaks, practice deep breathing, or engage in a hobby you enjoy',
          'Avoid tobacco and limit alcohol',
          'Stay connected — maintain relationships with friends and family',
        ],
      },
      {
        heading: 'Preventive Care',
        body: ['Healthy habits also include preventive actions such as:'],
        list: [
          'Routine health check-ups and screenings',
          'Keeping vaccinations up to date',
          'Practicing good hand hygiene',
          'Wearing seatbelts and following safety precautions',
        ],
      },
      {
        heading: 'Getting Started',
        body: [
          'You do not need to change everything at once. Pick one or two habits, build them consistently for a few weeks, and then add another. Small, sustainable changes are more likely to last than drastic ones.',
        ],
      },
      {
        heading: 'When to Seek Guidance',
        body: ['If you are trying to make significant lifestyle changes for a specific health condition, such as high blood pressure, diabetes, or weight management, talk to a healthcare provider for personalized advice.'],
      },
    ],
  },

  'Treating Minor Cuts': {
    slug: 'treating-minor-cuts',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Minor cuts and scrapes are common and usually heal well with simple first aid at home. Proper cleaning and care reduce the risk of infection and help the wound heal faster.',
        ],
      },
      {
        heading: 'Step-by-Step First Aid',
        body: ['For a minor cut or scrape:'],
        list: [
          'Wash your hands thoroughly before touching the wound',
          'Stop the bleeding by applying gentle, steady pressure with a clean cloth or gauze for a few minutes',
          'Clean the wound gently with clean water; mild soap can be used around (not directly in) the wound',
          'Remove any visible dirt or debris carefully; see a doctor if debris is deeply embedded',
          'Apply a thin layer of antiseptic ointment if available',
          'Cover with a clean adhesive bandage or sterile dressing, especially if the cut is in an area likely to get dirty or rub against clothing',
          'Change the dressing daily, or whenever it becomes wet or dirty',
        ],
      },
      {
        heading: 'Signs of Healing',
        body: ['A normally healing wound will show mild redness and swelling for a day or two, followed by scabbing and gradual closing over the next several days.'],
      },
      {
        heading: 'When to See a Doctor',
        body: ['Seek medical care if:'],
        list: [
          'The bleeding does not stop after 10–15 minutes of firm pressure',
          'The cut is deep, gaping, or was caused by a dirty or rusty object',
          'You notice increasing redness, warmth, swelling, pus, or a bad smell — signs of infection',
          'The wound was caused by an animal or human bite',
          'You have not had a tetanus booster in the last 5–10 years and the wound is dirty or deep',
          'The cut is on the face, or over a joint and is gaping open',
        ],
      },
      {
        heading: 'Prevention',
        body: ['Use protective gear when handling sharp tools, keep work areas tidy, and store sharp objects safely, especially around children.'],
      },
    ],
  },

  'Managing Stress': {
    slug: 'managing-stress',
    sections: [
      {
        heading: 'Overview',
        body: [
          "Stress is a normal response to life's demands, but ongoing, unmanaged stress can affect both your physical and mental health. Learning practical ways to manage stress can improve your mood, sleep, and overall wellbeing.",
        ],
      },
      {
        heading: 'Common Signs of Stress',
        body: ['Stress can show up in different ways, including:'],
        list: [
          'Feeling tense, anxious, or irritable',
          'Difficulty concentrating',
          'Trouble sleeping or oversleeping',
          'Headaches, muscle tension, or stomach upset',
          'Changes in appetite',
          'Feeling overwhelmed or on edge',
        ],
      },
      {
        heading: 'Practical Techniques',
        body: ['Try incorporating some of these into your routine:'],
        list: [
          'Practice slow, deep breathing for a few minutes when feeling overwhelmed',
          'Get regular physical activity — even a short walk can help',
          'Maintain a consistent sleep routine',
          'Break large tasks into smaller, manageable steps',
          'Set aside time for activities you enjoy',
          "Talk to someone you trust about what you're feeling",
          'Limit caffeine and alcohol, which can worsen anxiety',
        ],
      },
      {
        heading: 'Building Long-Term Resilience',
        body: [
          'Regular exercise, good sleep, strong social connections, and setting realistic boundaries at work and home all help build resilience to stress over time. Mindfulness and relaxation practices, such as meditation, can also be helpful.',
        ],
      },
      {
        heading: 'When to Seek Help',
        body: ['Reach out to a healthcare provider or mental health professional if stress:'],
        list: [
          'Feels constant or unmanageable',
          'Is affecting your sleep, appetite, work, or relationships for more than a couple of weeks',
          'Comes with persistent low mood, hopelessness, or loss of interest in things you used to enjoy',
          'Is accompanied by thoughts of self-harm — if this happens, seek help immediately from a trusted person, healthcare provider, or emergency services',
        ],
      },
    ],
  },
}
