// script.js (Corrected Working Version)
// script.js (Full working version)
// Paste this file and make sure your HTML has elements with ids:
// #messages, #input (textarea), #sendBtn, #micBtn, #status, #clearBtn, #exportBtn, #themeBtn
document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, el = document) => el.querySelector(sel);

  const messagesEl = $('#messages');
  const inputEl = $('#input');
  const sendBtn = $('#sendBtn');
  const micBtn = $('#micBtn');
  const statusEl = $('#status');
  const STORAGE_KEY = 'fullpage-chat-history-v1';

  if (!messagesEl || !inputEl || !sendBtn) {
    console.error('Required DOM elements (#messages, #input, #sendBtn) not found.');
    return;
  }

  // ===== Helpers =====
  function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

  function addMessage(text, who = 'bot') {
    const msg = document.createElement('div');
    msg.className = `msg ${who}`;
    if (who === 'bot') {
      msg.innerHTML = text || '';
    } else {
      msg.textContent = text || '';
    }
    messagesEl.appendChild(msg);
    persist();
    scrollToBottom();
    return msg;
  }

  function addTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    wrap.innerHTML = '<span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function persist() {
    const items = [...messagesEl.children].map(node => ({
      who: node.classList.contains('user') ? 'user' : 'bot',
      html: node.innerHTML,
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not persist chat history', e);
    }
  }

  function restore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const items = JSON.parse(raw);
      messagesEl.innerHTML = '';
      for (const it of items) {
        const div = document.createElement('div');
        div.className = `msg ${it.who}`;
        div.innerHTML = it.html;
        messagesEl.appendChild(div);
      }
      scrollToBottom();
    } catch (e) {
      console.error('Failed to restore chat', e);
    }
  }





















const sidebar = document.getElementById("sidebar");
const logoBtn = document.getElementById("logoBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");

const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const newChatBtn = document.getElementById("newChatBtn");
const historyList = document.getElementById("historyList");

let chats = JSON.parse(localStorage.getItem("chats")) || [];
let currentChat = [];

// Toggle sidebar
logoBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
});
closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

// Send message
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  let text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  // Fake bot reply
  setTimeout(() => {
    addMessage("bot", "You said: " + text);
  }, 500);
}

// Add message to chat
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `chat-message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  currentChat.push({ sender, text });
  saveChat();
}

// Save chat to localStorage
function saveChat() {
  if (currentChat.length > 0) {
    chats[chats.length - 1] = currentChat;
    localStorage.setItem("chats", JSON.stringify(chats));
    renderHistory();
  }
}

// Start a new chat
newChatBtn.addEventListener("click", () => {
  if (currentChat.length > 0) {
    chats.push([]);
    localStorage.setItem("chats", JSON.stringify(chats));
  }
  currentChat = [];
  chatBox.innerHTML = "";
  renderHistory();
});

// Render history
function renderHistory() {
  historyList.innerHTML = "";
  chats.forEach((chat, index) => {
    if (chat.length > 0) {
      let li = document.createElement("li");
      li.textContent = chat[0].text.substring(0, 20) + "...";
      li.addEventListener("click", () => loadChat(index));
      historyList.appendChild(li);
    }
  });
}

// Load a chat
function loadChat(index) {
  currentChat = chats[index];
  chatBox.innerHTML = "";
  currentChat.forEach(msg => {
    addMessage(msg.sender, msg.text);
  });
}

// Init
if (chats.length === 0) {
  chats.push([]);
}
currentChat = chats[chats.length - 1];
renderHistory();
















  // ===== Medical Advice Function (returns HTML string or null) =====
  function getMedicalAdvice(symptomRaw) {
    if (!symptomRaw) return null;
    const symptom = symptomRaw.toLowerCase().trim();

    const data = {
      "asthma": "<b>Symptoms:</b> Breathlessness, wheezing<br><b>Medicines:</b> Salbutamol inhaler (use as directed)<br><b>Food:</b> Avoid cold items<br><b>Timing:</b> Morning and night<br><b>Recovery Time:</b> Chronic - needs long-term management<br><i>Consult pediatrician immediately for severe breathing issues.</i>",

      "cold for baby": "<b>Symptoms:</b> Sneezing, runny nose, low fever<br><b>Medicines:</b> Paracetamol 250mg (if fever) + saline drops<br><b>Food:</b> Warm soups, fluids<br><b>Recovery Time:</b> 3–7 days",

      "viral fever": "<b>Symptoms:</b> High temperature, body ache<br><b>Medicines:</b> Paracetamol per doctor guidance<br><b>Food:</b> Hydration, light foods<br><b>Note:</b> Seek medical care if fever persists",

      "ear infection": "<b>Symptoms:</b> Ear pain, fever, irritability<br><b>Medicines:</b> Paracetamol and possibly antibiotics if prescribed<br><b>Recovery Time:</b> 3–5 days",

      "diarrhea": "<b>Symptoms:</b> Loose stools, dehydration risk<br><b>Medicines:</b> ORS, Zinc syrup (10mg/day for 10 days)<br><b>Food:</b> BRAT diet (banana, rice, applesauce, toast) / curd rice<br><b>Timing:</b> ORS after each stool<br><b>Recovery Time:</b> 2–4 days",

      "stomach pain": "Stomach pain can have many causes. Keep hydrated and rest. If severe or persistent, consult a doctor.",

      "chickenpox": "<b>Symptoms:</b> Blisters, fever, itching<br><b>Medicines:</b> Paracetamol for fever, calamine lotion for itching<br><b>Food:</b> Soft, non-spicy food<br><b>Recovery Time:</b> 7–10 days",

      "tonsillitis for baby": "<b>Symptoms:</b> Sore throat, difficulty swallowing<br><b>Medicines:</b> Amoxicillin (weight-based, 3x/day)<br><b>Food:</b> Warm fluids, avoid cold drinks<br><b>Recovery Time:</b> 5–7 days",

      "worm infestation for baby": "<b>Symptoms:</b> Itchy anus, stomach pain<br><b>Medicines:</b> Albendazole 200mg once<br><b>Food:</b> Garlic, greens<br><b>Recovery Time:</b> 1–2 days",

      "scabies for baby": "<b>Symptoms:</b> Night itching<br><b>Medicines:</b> Permethrin lotion<br><b>Recovery Time:</b> 3–5 days",

      "constipation for baby": "<b>Symptoms:</b> Hard stool, stomach pain<br><b>Medicines:</b> Lactulose syrup<br><b>Food:</b> Fiber foods<br><b>Recovery Time:</b> 2–3 days",



      "asthma for baby":"<b>Symptoms:</b> Breathlessness, wheezing <br><b>Medicines:</b> Salbutamol inhaler <br><b>Food:</b> Avoid cold items <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> Chronic",
      "piles for baby":"<b>Symptoms:</b> Pain during passing stools <br><b>Medicines:</b> Sitz bath, ointments <br><b>Food:</b> Fiber-rich, papaya <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> 3–5 days",
      "skin fungal infection for baby":"<b>Symptoms:</b> Red, itchy patches <br><b>Medicines:</b> Clotrimazole cream <br><b>Food:</b> Reduce sugar <br><b>Timing:</b> Apply morning and night <br><b>Recovery Time:</b> 1–2 weeks",
      "leg cramps for baby":"<b>Symptoms:</b> Night leg pain <br><b>Medicines:</b> Magnesium supplement <br><b>Food:</b> Banana, coconut water <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Few days",
      "stroke (minor) for baby":"<b>Symptoms:</b> Weakness on one side, slurred speech <br><b>Medicines:</b> Aspirin 75mg, Clopidogrel <br><b>Food:</b> Low-fat, no salt <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Ongoing therapy required",
      "low blood pressure for baby":"<b>Symptoms:</b> Dizziness, fatigue <br><b>Medicines:</b> Fludrocortisone (if severe) <br><b>Food:</b> Salted water, fluids <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> 2–3 days (if acute)",
      "gallstones for baby":"<b>Symptoms:</b> Upper right stomach pain <br><b>Medicines:</b> Ursodiol (if advised) <br><b>Food:</b> Avoid oily food <br><b>Timing:</b> After food <br><b>Recovery Time:</b> May need surgery",
      "peptic ulcer for baby":"<b>Symptoms:</b> Upper stomach pain <br><b>Medicines:</b> Omeprazole 20mg <br><b>Food:</b> Avoid spicy and acidic foods <br><b>Timing:</b> Before breakfast <br><b>Recovery Time:</b> 2–4 weeks",
      "hemorrhoids for baby":"<b>Symptoms:</b> Bleeding while passing stool <br><b>Medicines:</b> Suppositories, stool softeners <br><b>Food:</b> Fiber diet, water <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> 5–7 days",
      "shingles (herpes zoster) for baby":"<b>Symptoms:</b> Painful skin rash <br><b>Medicines:</b> Acyclovir tablets <br><b>Food:</b> Light, cool food <br><b>Timing:</b> 3x a day <br><b>Recovery Time:</b> 7–10 days",
      "high cholesterol for baby":"<b>Symptoms:</b> Usually silent <br><b>Medicines:</b> Atorvastatin 10mg <br><b>Food:</b> Oats, green tea, no fried food <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Long-term management",
      "alzheimers disease for baby":"<b>Symptoms:</b> Memory loss, confusion <br><b>Medicines:</b> Donepezil, Memantine <br><b>Food:</b> Nuts, berries, leafy greens <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Progressive disorder",
      "dental decay for baby":"<b>Symptoms:</b> Toothache, decay <br><b>Medicines:</b> Dental cleaning, fluoride <br><b>Food:</b> Soft food, avoid sweets <br><b>Timing:</b> After meals <br><b>Recovery Time:</b> Varies",
      "dehydration for baby":"<b>Symptoms:</b> Dry mouth, low urine <br><b>Medicines:</b> ORS, electrolyte solutions <br><b>Food:</b> Coconut water, juices <br><b>Timing:</b> After meals <br><b>Recovery Time:</b> 1–2 days",
      "knee pain for baby":"<b>Symptoms:</b> Pain while walking <br><b>Medicines:</b> Calcium, pain ointment <br><b>Food:</b> Sesame, milk, turmeric <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Ongoing",
      "varicose veins for baby":"<b>Symptoms:</b> Swollen, twisted veins <br><b>Medicines:</b> Compression socks, Diosmin <br><b>Food:</b> High fiber <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Slow – improves with rest",
      "lung infection (pneumonia) for baby":"<b>Symptoms:</b> Cough, fever, breathlessness <br><b>Medicines:</b> Azithromycin or Amoxiclav <br><b>Food:</b> Soup, fluids <br><b>Timing:</b> After food <br><b>Recovery Time:</b> 7–10 days",
      "thyroid imbalance for baby":"<b>Symptoms:</b> Fatigue, weight gain or loss <br><b>Medicines:</b> Thyroxine <br><b>Food:</b> Avoid cabbage, soy <br><b>Timing:</b> Early morning <br><b>Recovery Time:</b> Long-term",
      "frozen shoulder (repeat) for baby":"<b>Symptoms:</b> Shoulder stiffness, pain <br><b>Medicines:</b> Physiotherapy, painkillers <br><b>Food:</b> No restriction <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Weeks to months",
      "low vision for baby":"<b>Symptoms:</b> Blurred sight <br><b>Medicines:</b> Vitamin A, spectacles <br><b>Food:</b> Carrots, mango <br><b>Timing:</b> After food <br><b>Recovery Time:</b> Supportive",
      "sciatica for baby":"<b>Symptoms:</b> Back to leg pain <br><b>Medicines:</b> Pregabalin, painkillers <br><b>Food:</b> No restriction <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Varies",
      "bladder infection for baby":"<b>Symptoms:</b> Burning urination, fever <br><b>Medicines:</b> Nitrofurantoin <br><b>Food:</b> Cranberry juice <br><b>Timing:</b> After meals <br><b>Recovery Time:</b> 5–7 days",
      "b12 deficiency for baby":"<b>Symptoms:</b> Numbness, tiredness <br><b>Medicines:</b> B12 tablets or injection <br><b>Food:</b> Egg, milk <br><b>Timing:</b> After food <br><b>Recovery Time:</b> 2–4 weeks",
      "tinnitusfor baby":"<b>Symptoms:</b> Buzzing in ear <br><b>Medicines:</b> Ginkgo biloba (sometimes) <br><b>Food:</b> Reduce caffeine <br><b>Timing:</b> Daily <br><b>Recovery Time:</b> Varies",
      "skin dryness for baby":"<b>Symptoms:</b> Flaky skin <br><b>Medicines:</b> Moisturizer <br><b>Food:</b> Water, coconut oil <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> Ongoing",
      "balance issues for baby":"<b>Symptoms:</b> Unsteadiness <br><b>Medicines:</b> Vitamin D, physical therapy <br><b>Food:</b> Hydration, protein <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Varies",
      "fatigue syndrome for baby":"<b>Symptoms:</b> Tiredness, no energy <br><b>Medicines:</b> B-complex, iron <br><b>Food:</b> Dates, greens, nuts <br><b>Timing:</b> After breakfast <br><b>Recovery Time:</b> 1–2 weeks",
      "gum infections for baby":"<b>Symptoms:</b> Swelling, bleeding gums <br><b>Medicines:</b> Chlorhexidine mouthwash <br><b>Food:</b> Soft food <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> 3–5 days",
      "depressive dementia for baby":"<b>Symptoms:</b> Sadness + memory loss <br><b>Medicines:</b> Antidepressants, Donepezil <br><b>Food:</b> Leafy greens, coconut oil <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Ongoing – support essential",


 "hypertension": "<b>Symptoms:</b> Headache, blurred vision <br><b>Medicines:</b> Amlodipine 5mg once daily <br><b>Food:</b> Low salt, leafy vegetables <br><b>Timing:</b> Morning after food <br><b>Recovery Time:</b> Chronic – long-term control",
      "type 2 diabetes": "<b>Symptoms:</b> Frequent urination, thirst, fatigue <br><b>Medicines:</b> Metformin 500mg twice daily <br><b>Food:</b> Low sugar, high fiber diet <br><b>Timing:</b> After meals <br><b>Recovery Time:</b> Ongoing – lifestyle control needed",
      "arthritis": "<b>Symptoms:</b> Joint pain, stiffness <br><b>Medicines:</b> Aceclofenac + Paracetamol <br><b>Food:</b> Turmeric, ginger <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> Varies – usually long term",
      "cataract": "<b>Symptoms:</b> Blurry vision, sensitivity to light <br><b>Medicines:</b> Requires surgery, eye drops post-op <br><b>Food:</b> Vitamin A-rich food (carrots, pumpkin) <br><b>Timing:</b> As advised post-surgery <br><b>Recovery Time:</b> 1–2 weeks post-surgery",
      "constipation": "<b>Symptoms:</b> Hard stools, straining <br><b>Medicines:</b> Lactulose syrup or Isabgol <br><b>Food:</b> Papaya, water, fiber-rich diet <br><b>Timing:</b> Night before bed <br><b>Recovery Time:</b> 2–3 days",
      "dementia": "<b>Symptoms:</b> Memory loss, confusion <br><b>Medicines:</b> Donepezil, Rivastigmine <br><b>Food:</b> Walnuts, spinach, fish <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Progressive – supportive care",
      "parkinsons disease": "<b>Symptoms:</b> Tremors, movement difficulty <br><b>Medicines:</b> Levodopa + Carbidopa <br><b>Food:</b> Balanced protein meals <br><b>Timing:</b> Before food <br><b>Recovery Time:</b> Long-term management",
      "urinary incontinence": "<b>Symptoms:</b> Sudden urge or leakage of urine <br><b>Medicines:</b> Tolterodine 2mg <br><b>Food:</b> Reduce caffeine, drink fluids in daytime <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Long-term condition",
      "osteoporosis": "<b>Symptoms:</b> Fragile bones, fractures <br><b>Medicines:</b> Calcium + Vitamin D3 <br><b>Food:</b> Milk, sesame, greens <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Long-term supplements",
      "GERD (acid reflux)": "<b>Symptoms:</b> Heartburn, chest discomfort <br><b>Medicines:</b> Pantoprazole 40mg <br><b>Food:</b> Avoid spicy, eat early dinner <br><b>Timing:</b> Before breakfast <br><b>Recovery Time:</b> 3–5 days (long-term if chronic)",
      "chronic obstructive pulmonary disease (COPD)": "<b>Symptoms:</b> Cough, breathlessness, wheezing <br><b>Medicines:</b> Salbutamol inhaler, Tiotropium <br><b>Food:</b> Ginger, garlic, omega-3 foods <br><b>Timing:</b> As per inhaler schedule <br><b>Recovery Time:</b> Chronic – long-term control",
      "pneumonia": "<b>Symptoms:</b> Fever, cough with sputum, chest pain <br><b>Medicines:</b> Amoxicillin, Azithromycin <br><b>Food:</b> Warm soups, fluids, fruits <br><b>Timing:</b> After food <br><b>Recovery Time:</b> 1–2 weeks",
      "tuberculosis (TB)": "<b>Symptoms:</b> Persistent cough, weight loss, night sweats <br><b>Medicines:</b> Rifampicin, Isoniazid, Pyrazinamide, Ethambutol <br><b>Food:</b> Protein-rich diet, milk, eggs <br><b>Timing:</b> Morning on empty stomach <br><b>Recovery Time:</b> 6–9 months",
      "lung cancer": "<b>Symptoms:</b> Chronic cough, chest pain, weight loss <br><b>Medicines:</b> Chemotherapy, targeted therapy <br><b>Food:</b> High-protein, antioxidant-rich foods <br><b>Timing:</b> As per oncologist advice <br><b>Recovery Time:</b> Depends on stage – long-term",
      "influenza (flu)": "<b>Symptoms:</b> Fever, sore throat, body aches <br><b>Medicines:</b> Oseltamivir, Paracetamol <br><b>Food:</b> Citrus fruits, fluids, soups <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> 5–7 days",
      "hepatitis B": "<b>Symptoms:</b> Jaundice, fatigue, abdominal pain <br><b>Medicines:</b> Tenofovir, Entecavir <br><b>Food:</b> Avoid alcohol, eat leafy greens <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Months – chronic management",
      "liver cirrhosis": "<b>Symptoms:</b> Swelling in legs, jaundice, confusion <br><b>Medicines:</b> Diuretics, Lactulose <br><b>Food:</b> Low salt, high protein diet <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> Chronic – no full cure",
      "gallstones": "<b>Symptoms:</b> Severe abdominal pain, nausea <br><b>Medicines:</b> Ursodeoxycholic acid (for small stones) <br><b>Food:</b> Low-fat diet <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Often requires surgery",
      "pancreatitis": "<b>Symptoms:</b> Abdominal pain, vomiting <br><b>Medicines:</b> Painkillers, pancreatic enzymes <br><b>Food:</b> Bland diet, fluids <br><b>Timing:</b> After meals <br><b>Recovery Time:</b> 1–4 weeks (acute)",
      "chronic kidney disease (CKD)": "<b>Symptoms:</b> Swelling, fatigue, reduced urine <br><b>Medicines:</b> ACE inhibitors, diuretics <br><b>Food:</b> Low salt, low potassium diet <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Chronic – lifelong management",
      "kidney stones": "<b>Symptoms:</b> Severe flank pain, blood in urine <br><b>Medicines:</b> Tamsulosin, painkillers <br><b>Food:</b> Drink plenty of water, avoid spinach <br><b>Timing:</b> As per pain relief need <br><b>Recovery Time:</b> Days to weeks",
      "urinary tract infection (UTI)": "<b>Symptoms:</b> Burning urination, fever, pain <br><b>Medicines:</b> Nitrofurantoin, Ciprofloxacin <br><b>Food:</b> Cranberry juice, water <br><b>Timing:</b> After meals <br><b>Recovery Time:</b> 5–7 days",
      "benign prostatic hyperplasia (BPH)": "<b>Symptoms:</b> Frequent urination, weak stream <br><b>Medicines:</b> Tamsulosin, Finasteride <br><b>Food:</b> Pumpkin seeds, tomato (lycopene) <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Long-term management",
      "prostate cancer": "<b>Symptoms:</b> Urination problems, pelvic pain <br><b>Medicines:</b> Hormone therapy, chemotherapy <br><b>Food:</b> Tomatoes, green tea, broccoli <br><b>Timing:</b> As advised <br><b>Recovery Time:</b> Depends on stage",
      "breast cancer": "<b>Symptoms:</b> Lump in breast, nipple discharge <br><b>Medicines:</b> Chemotherapy, hormone therapy <br><b>Food:</b> Berries, omega-3 foods, leafy vegetables <br><b>Timing:</b> As advised <br><b>Recovery Time:</b> Depends on treatment stage",
      "cervical cancer": "<b>Symptoms:</b> Irregular bleeding, pelvic pain <br><b>Medicines:</b> Surgery, chemotherapy, radiotherapy <br><b>Food:</b> Green leafy vegetables, garlic <br><b>Timing:</b> As advised <br><b>Recovery Time:</b> Depends on stage",
      "endometriosis": "<b>Symptoms:</b> Painful periods, infertility <br><b>Medicines:</b> Hormonal therapy, painkillers <br><b>Food:</b> Omega-3 foods, fresh vegetables <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Varies – chronic",
      "polycystic ovary syndrome (PCOS)": "<b>Symptoms:</b> Irregular periods, weight gain, acne <br><b>Medicines:</b> Metformin, hormonal therapy <br><b>Food:</b> Low-carb diet, high protein <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> Long-term management",
      "miscarriage": "<b>Symptoms:</b> Vaginal bleeding, abdominal cramps <br><b>Medicines:</b> Supportive care, antibiotics if needed <br><b>Food:</b> Iron-rich diet, fruits <br><b>Timing:</b> As prescribed <br><b>Recovery Time:</b> 2–6 weeks",
      "depression": "<b>Symptoms:</b> Low mood, loss of interest, insomnia <br><b>Medicines:</b> SSRIs (Fluoxetine, Sertraline) <br><b>Food:</b> Omega-3 foods, nuts, bananas <br><b>Timing:</b> Morning <br><b>Recovery Time:</b> Weeks to months",
      "schizophrenia": "<b>Symptoms:</b> Hallucinations, disorganized thoughts <br><b>Medicines:</b> Antipsychotics (Olanzapine, Risperidone) <br><b>Food:</b> Omega-3, whole grains <br><b>Timing:</b> Night <br><b>Recovery Time:</b> Long-term management",
      "bipolar disorder": "<b>Symptoms:</b> Mood swings, depression, mania <br><b>Medicines:</b> Lithium, Valproate <br><b>Food:</b> Fresh fruits, vegetables, avoid alcohol <br><b>Timing:</b> Morning and night <br><b>Recovery Time:</b> Long-term management",
      "anxiety disorder": "<b>Symptoms:</b> Nervousness, palpitations, sweating<br><b>Medicines:</b> Benzodiazepines, SSRIs<br><b>Food:</b> Chamomile tea, omega-3 foods<br><b>Timing:</b> Night<br><b>Recovery Time:</b> Weeks to months",
      "autism spectrum disorder": "<b>Symptoms:</b> Social communication issues, repetitive behavior<br><b>Medicines:</b> Supportive therapy (Risperidone sometimes)<br><b>Food:</b> Balanced diet, gluten-free (optional)<br><b>Timing:</b> As advised<br><b>Recovery Time:</b> Lifelong supportive",
      "attention deficit hyperactivity disorder (ADHD)": "<b>Symptoms:</b> Inattention, hyperactivity<br><b>Medicines:</b> Methylphenidate, Atomoxetine<br><b>Food:</b> Omega-3 foods, protein diet<br><b>Timing:</b> Morning<br><b>Recovery Time:</b> Lifelong management",
      "Depression": "<b>Symptoms:</b> Sadness, loss of interest<br><b>Medicines:</b> Escitalopram, Sertraline<br><b>Food:</b> Omega-3, bananas<br><b>Timing:</b> Morning<br><b>Recovery:</b> Gradual improvement",
      "Anemia": "<b>Symptoms:</b> Fatigue, pale skin<br><b>Medicines:</b> Ferrous sulfate tablets<br><b>Food:</b> Beetroot, spinach, jaggery<br><b>Timing:</b> After food<br><b>Recovery:</b> 2–4 weeks",
      "Back Pain": "<b>Symptoms:</b> Pain in lower back<br><b>Medicines:</b> Pain relief gel, Paracetamol<br><b>Food:</b> Anti-inflammatory foods<br><b>Timing:</b> Morning and night<br><b>Recovery:</b> Varies",
      "Hearing Loss": "<b>Symptoms:</b> Difficulty hearing conversations<br><b>Medicines:</b> Hearing aid, Vitamin B12<br><b>Food:</b> Fish, nuts<br><b>Timing:</b> Daily supplement<br><b>Recovery:</b> Supportive – aids needed",
      "Vertigo": "<b>Symptoms:</b> Dizziness, imbalance<br><b>Medicines:</b> Betahistine 16mg<br><b>Food:</b> Hydration, low salt<br><b>Timing:</b> Morning and night<br><b>Recovery:</b> 3–7 days or recurring",
      "Gout": "<b>Symptoms:</b> Joint swelling, toe pain<br><b>Medicines:</b> Allopurinol 100mg<br><b>Food:</b> Avoid red meat, take more water<br><b>Timing:</b> Morning<br><b>Recovery:</b> 1–2 weeks",
      "Dry Mouth (Xerostomia)": "<b>Symptoms:</b> Dry tongue, sticky mouth<br><b>",





"mouth ulcers": "<b>Symptoms:</b> Painful mouth sores<br><b>Medicines:</b> Mucaine gel, B-complex<br><b>Food:</b> Curd rice, avoid spicy<br><b>Timing:</b> After food<br><b>Recovery:</b> 3–5 days",
    "lice infestation": "<b>Symptoms:</b> Itchy scalp<br><b>Medicines:</b> Permethrin shampoo<br><b>Food:</b> No restrictions<br><b>Timing:</b> 2–3 times a week<br><b>Recovery:</b> 1–2 weeks",
    "dengue fever": "<b>Symptoms:</b> High fever, body pain<br><b>Medicines:</b> Paracetamol only<br><b>Food:</b> Papaya leaf juice, fluids<br><b>Timing:</b> Every 6 hrs<br><b>Recovery:</b> 7–10 days",
    "sinusitis": "<b>Symptoms:</b> Headache, blocked nose<br><b>Medicines:</b> Antihistamine, steam<br><b>Food:</b> Avoid cold foods<br><b>Timing:</b> Night<br><b>Recovery:</b> 5–7 days",
    "hand foot and mouth disease": "<b>Symptoms:</b> Blisters, mouth ulcers<br><b>Medicines:</b> Paracetamol<br><b>Food:</b> Cold liquids<br><b>Timing:</b> As needed<br><b>Recovery:</b> 5–7 days",
    "bronchitis": "<b>Symptoms:</b> Cough, chest pain<br><b>Medicines:</b> Bronchodilator syrup<br><b>Food:</b> Soup, warm water<br><b>Timing:</b> Morning and night<br><b>Recovery:</b> 5–7 days",
    "teething fever": "<b>Symptoms:</b> Low fever, irritability<br><b>Medicines:</b> Paracetamol drops<br><b>Food:</b> Cool mashed food<br><b>Timing:</b> Every 6–8 hrs<br><b>Recovery:</b> 2–3 days",
    "eye conjunctivitis": "<b>Symptoms:</b> Redness, watery eyes<br><b>Medicines:</b> Antibiotic eye drops<br><b>Food:</b> No restriction<br><b>Timing:</b> 3x daily<br><b>Recovery:</b> 3–5 days",
    "skin rash": "<b>Symptoms:</b> Itchy bumps on skin<br><b>Medicines:</b> Calamine lotion<br><b>Food:</b> Cool fluids<br><b>Timing:</b> Apply twice a day<br><b>Recovery:</b> 3–4 days",
    "vomiting": "<b>Symptoms:</b> Nausea, vomiting<br><b>Medicines:</b> Domperidone syrup<br><b>Food:</b> ORS, soft rice<br><b>Timing:</b> After vomiting<br><b>Recovery:</b> 1–2 days",
    "night terrors": "<b>Symptoms:</b> Screaming in sleep<br><b>Medicines:</b> None usually<br><b>Food:</b> Light dinner<br><b>Timing:</b> Bedtime routine<br><b>Recovery:</b> Improves with age",
    "pinworms": "<b>Symptoms:</b> Anal itching<br><b>Medicines:</b> Albendazole 200mg once<br><b>Food:</b> Garlic, fiber food<br><b>Timing:</b> Night<br><b>Recovery:</b> 1 day",
    "hiccups": "<b>Symptoms:</b> Sudden repeated hiccups<br><b>Medicines:</b> Usually none<br><b>Food:</b> Warm water<br><b>Timing:</b> After meals if needed<br><b>Recovery:</b> Few minutes to 1 hour",
    "jaundice neonatal": "<b>Symptoms:</b> Yellow eyes and skin<br><b>Medicines:</b> Phototherapy if severe<br><b>Food:</b> Frequent breastfeeding<br><b>Timing:</b> Regular intervals<br><b>Recovery:</b> 3–10 days",
    "colic": "<b>Symptoms:</b> Unexplained crying<br><b>Medicines:</b> Colic drops<br><b>Food:</b> Mother to avoid gas-producing foods<br><b>Timing:</b> As prescribed<br><b>Recovery:</b> 3–4 months",
    "throat infection": "<b>Symptoms:</b> Sore throat, fever<br><b>Medicines:</b> Amoxicillin<br><b>Food:</b> Warm drinks<br><b>Timing:</b> After food<br><b>Recovery:</b> 5–7 days",
    "bedwetting": "<b>Symptoms:</b> Night-time urination<br><b>Medicines:</b> Desmopressin (if required)<br><b>Food:</b> Reduce water at night<br><b>Timing:</b> Bedtime<br><b>Recovery:</b> Improves with age",
    "ear wax blockage": "<b>Symptoms:</b> Reduced hearing, discomfort<br><b>Medicines:</b> Wax dissolving drops<br><b>Food:</b> No restriction<br><b>Timing:</b> 2–3 times daily<br><b>Recovery:</b> 2–3 days",
    "speech delay": "<b>Symptoms:</b> Late talking<br><b>Medicines:</b> None (speech therapy suggested)<br><b>Food:</b> Omega-3 rich foods<br><b>Timing:</b> Daily<br><b>Recovery:</b> Gradual",
    "hyperactivity": "<b>Symptoms:</b> Restlessness, poor focus<br><b>Medicines:</b> Behavioral therapy, rarely meds<br><b>Food:</b> Avoid sugars<br><b>Timing:</b> Lifestyle-based<br><b>Recovery:</b> Ongoing",
    "insect bite allergy": "<b>Symptoms:</b> Swelling, itching<br><b>Medicines:</b> Antihistamine syrup<br><b>Food:</b> Avoid allergens<br><b>Timing:</b> Night<br><b>Recovery:</b> 1–3 days",
    "minor burns": "<b>Symptoms:</b> Redness, pain<br><b>Medicines:</b> Burn ointment<br><b>Food:</b> Fluids, soft food<br><b>Timing:</b> 2x daily application<br><b>Recovery:</b> 3–5 days",
    "nosebleed": "<b>Symptoms:</b> Bleeding from nose<br><b>Medicines:</b> Nasal drops, ice pack<br><b>Food:</b> Cold fruits<br><b>Timing:</b> As needed<br><b>Recovery:</b> 1–2 days",
    "mild head injury": "<b>Symptoms:</b> Headache, mild swelling<br><b>Medicines:</b> Paracetamol<br><b>Food:</b> Fluids, soft diet<br><b>Timing:</b> As needed<br><b>Recovery:</b> 2–3 days",
    "sprain": "<b>Symptoms:</b> Swelling, pain<br><b>Medicines:</b> Ice pack, pain gel<br><b>Food:</b> Normal<br><b>Timing:</b> Apply twice a day<br><b>Recovery:</b> 3–5 days",
    "food poisoning": "<b>Symptoms:</b> Vomiting, diarrhea<br><b>Medicines:</b> ORS, Domperidone<br><b>Food:</b> Soft rice, banana<br><b>Timing:</b> After vomiting<br><b>Recovery:</b> 2–4 days",
    "boils": "<b>Symptoms:</b> Painful skin lump<br><b>Medicines:</b> Mupirocin ointment<br><b>Food:</b> Turmeric milk<br><b>Timing:</b> Apply 2x daily<br><b>Recovery:</b> 5–7 days",
    "skin allergy": "<b>Symptoms:</b> Rashes, itching<br><b>Medicines:</b> Antihistamine, calamine lotion<br><b>Food:</b> Avoid allergens<br><b>Timing:</b> Night<br><b>Recovery:</b> 3–5 days",
    "sunburn": "<b>Symptoms:</b> Red skin, burning<br><b>Medicines:</b> Aloe vera gel<br><b>Food:</b> Cool drinks<br><b>Timing:</b> Apply twice daily<br><b>Recovery:</b> 2–4 days",
    "eye stye": "<b>Symptoms:</b> Swollen eyelid<br><b>Medicines:</b> Warm compress, antibiotic ointment<br><b>Food:</b> Normal<br><b>Timing:</b> 3x/day<br><b>Recovery:</b> 3–5 days",




  "motion sickness": "<b>Symptoms:</b> Nausea while traveling<br><b>Medicines:</b> Ondansetron<br><b>Food:</b> Light snacks before travel<br><b>Timing:</b> 30 min before journey<br><b>Recovery:</b> 1 day",
  "cold sores": "<b>Symptoms:</b> Blisters around lips<br><b>Medicines:</b> Antiviral cream<br><b>Food:</b> Avoid spicy<br><b>Timing:</b> Apply 3x/day<br><b>Recovery:</b> 5–7 days",
  "headache": "<b>Advice:</b> Try relaxing, drinking water, or taking a pain reliever if needed.",
  "body pain": "<b>Advice:</b> Body pain can be due to fatigue. Try a warm bath or light exercise.",
  "period pain": "<b>Advice:</b> For period pain, try using a heating pad, drinking warm fluids, and gentle stretching.",
  "covid": "<b>Note:</b> If you suspect you have COVID-19, please contact a healthcare professional immediately.",
  "covid vaccine": "<b>Info:</b> COVID vaccines help prevent severe illness. Consult your nearest healthcare provider for vaccination.",
  "h1n1 virus": "<b>Info:</b> H1N1 (Swine Flu) is a respiratory infection. If symptoms worsen, seek medical attention immediately.",
  "general medication": "<b>Warning:</b> Please consult a doctor before taking any medication. Avoid self-medication for serious symptoms.",
  "thank you": "You're welcome! Feel free to ask if you need more help.",
  "bye": "Goodbye! Take care.",
  "help": "I'm here to help. What do you need assistance with?",

  "fever": "<b>Symptoms:</b> High temperature, chills, body aches<br><b>Advice:</b> Rest well, stay hydrated, use a cool compress<br><b>Food:</b> Clear fluids, light soups, fruits<br><b>Timing:</b> Take paracetamol if temp >38°C<br><b>Recovery:</b> 2–7 days",
  
  "common cold": "<b>Symptoms:</b> Sneezing, runny nose, sore throat<br><b>Advice:</b> Steam inhalation, warm fluids, saline drops<br><b>Food:</b> Honey with warm water, soups<br><b>Timing:</b> Take rest and fluids immediately<br><b>Recovery:</b> 7–10 days",
  
  "body pain": "<b>Symptoms:</b> Muscle ache, stiffness<br><b>Advice:</b> Rest, gentle stretching, warm shower<br><b>Food:</b> Protein-rich food, vegetables<br><b>Timing:</b> Take pain relief if needed<br><b>Recovery:</b> 2–5 days",
  
  "headache": "<b>Symptoms:</b> Head pain, sensitivity to light<br><b>Advice:</b> Rest in dark room, drink water, avoid screen<br><b>Food:</b> Light meals, herbal tea<br><b>Timing:</b> Take medicine at onset of pain<br><b>Recovery:</b> Few hours to 2 days",
  
  "sore throat": "<b>Symptoms:</b> Painful swallowing, throat irritation<br><b>Advice:</b> Gargle salt water, lozenges, warm fluids<br><b>Food:</b> Soft foods, warm soups<br><b>Timing:</b> Relief measures immediately<br><b>Recovery:</b> 3–7 days",
  
  "indigestion": "<b>Symptoms:</b> Bloating, burning sensation<br><b>Advice:</b> Eat small meals, avoid spicy food<br><b>Food:</b> Rice, bananas, toast<br><b>Timing:</b> Avoid lying down after meals<br><b>Recovery:</b> Within 1 day",
  
  "diarrhea": "<b>Symptoms:</b> Loose stools, abdominal cramps<br><b>Advice:</b> ORS, rest, avoid heavy food<br><b>Food:</b> BRAT diet (Banana, Rice, Apple, Toast)<br><b>Timing:</b> Rehydrate immediately<br><b>Recovery:</b> 1–3 days",
  
  "constipation": "<b>Symptoms:</b> Hard stools, straining<br><b>Advice:</b> Drink water, eat fiber, exercise<br><b>Food:</b> Fruits, vegetables, whole grains<br><b>Timing:</b> Daily routine & hydration<br><b>Recovery:</b> 2–5 days",
  
  "allergy": "<b>Symptoms:</b> Sneezing, itchy eyes, runny nose<br><b>Advice:</b> Avoid triggers, stay in clean air<br><b>Food:</b> Warm fluids, vitamin C foods<br><b>Timing:</b> Antihistamine at symptom onset<br><b>Recovery:</b> 1–3 days",
  
  "back pain": "<b>Symptoms:</b> Lower back stiffness, pain<br><b>Advice:</b> Avoid heavy lifting, apply hot pack<br><b>Food:</b> Balanced diet, calcium-rich foods<br><b>Timing:</b> Start rest & heat immediately<br><b>Recovery:</b> Few days to weeks",
  
  "motion sickness": "<b>Symptoms:</b> Nausea, dizziness while travel<br><b>Advice:</b> Sit forward, fresh air, light snacks<br><b>Food:</b> Crackers, lemon water<br><b>Timing:</b> Take medicine 30 min before journey<br><b>Recovery:</b> Within 1 day",
  
  "period pain": "<b>Symptoms:</b> Lower abdominal cramps, back pain<br><b>Advice:</b> Use heating pad, gentle exercise, rest<br><b>Food:</b> Warm fluids, light meals<br><b>Timing:</b> Pain relief at onset of cramps<br><b>Recovery:</b> 1–3 days",
  
  "cold": "<b>Symptoms:</b> Blisters around lips, tingling<br><b>Advice:</b> Keep area clean, avoid touching<br><b>Food:</b> Soft, non-irritating foods<br><b>Timing:</b> Apply antiviral at first sign<br><b>Recovery:</b> 7–10 days",
  
  "insect bite": "<b>Symptoms:</b> Redness, swelling, itching<br><b>Advice:</b> Clean bite, apply cold compress<br><b>Food:</b> No restrictions<br><b>Timing:</b> Relief measures immediately<br><b>Recovery:</b> 1–3 days",
  
  "dehydration": "<b>Symptoms:</b> Dry mouth, dizziness, low urine<br><b>Advice:</b> Drink water or ORS, rest in cool place<br><b>Food:</b> Fresh fruits, electrolyte drinks<br><b>Timing:</b> Start hydration immediately<br><b>Recovery:</b> Few hours to 1 day",
  
  // unique patient records
  "24505631": "<b>Patient:</b> Narendra Prasath R <br><b>REG:</b> 54CS5652 <br><b>Condition:</b> Fever, high fever, and cold. <br><b>Advice:</b> Take rest.",
  "24505647": "<b>Patient:</b> RATHEESH NS <br><b>REG:</b> 11CER5432 <br><b>Condition:</b> Suspected broken hand. <br><b>Advice:</b> Avoid moving it, apply ice, and see a doctor as soon as possible.",
  "24505638": "<b>Patient:</b> NITHIS KUMAR <br><b>REG:</b> 12CER5432 <br><b>Condition:</b> Heart issue. <br><b>Advice:</b> Emergency! Seek immediate medical attention.",
      
    };

    // direct match
    if (data[symptom]) return data[symptom];

    // fuzzy heuristics for user inputs with punctuation or extra words:
    if (symptom.includes('asthma') && symptom.includes('baby')) return data['asthma for baby'];
    if (symptom.includes('cold') && symptom.includes('baby')) return data['cold for baby'];
    if (symptom.includes('viral') && symptom.includes('fever') && symptom.includes('baby')) return data['viral fever for baby'];
    if ((symptom.includes('ear') && symptom.includes('infection')) || (symptom.includes('ear') && symptom.includes('baby'))) return data['ear infection for baby'];
    if (symptom.includes('diarrhea') && symptom.includes('baby')) return data['diarrhea for baby'];
    if (symptom.includes('stomach') && symptom.includes('pain')) return data['stomach pain'];

    // if nothing found
    return null;
  }

  // ===== Simple demo bot logic (calls medical advice lookup first) =====
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function fakeAIResponse(userText) {
    await wait(300 + Math.random() * 400); // typing delay
    const lower = (userText || '').trim().toLowerCase();
    if (!lower) return "";

    // Medical lookup first
    const med = getMedicalAdvice(lower);
    if (med) return med;

    // greetings
    if (['hi', 'hello', 'hey', 'hai'].includes(lower)) {
      return "Hello! 👋 How can I help you today?";
    }
    // time ask
    if (lower.includes('time')) {
      return `It's ${new Date().toLocaleTimeString()} right now.`;
    }
    // clear instruction
    if (lower.includes('clear')) {
      return "You can clear the chat with the 🧹 Clear button at the top.";
    }

    const replies = [
      "Got it! Here's what I understood:<br>" + escapeHtml(userText),
      "Interesting — tell me more about that.",
      "If you want, I can summarize or generate an outline.",
      "Thanks for sharing! Want me to draft a reply?"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // small helper to escape user text when embedding in HTML responses
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  // ===== Sending messages =====
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    autoResize();
    addMessage(text, 'user');

    const typing = addTyping();
    let reply = '';
    try {
      reply = await fakeAIResponse(text);
    } catch (e) {
      console.error(e);
      reply = "Sorry, something went wrong while preparing the reply.";
    }
    typing.remove();
    // if reply is empty string, don't add blank message
    if (reply) addMessage(reply, 'bot');
  }

  // ===== Input behaviors =====
  function autoResize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + 'px';
  }
  inputEl.addEventListener('input', autoResize);
  autoResize();

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // ===== Voice input (optional) =====
  let recognition;
  let listening = false;
  try {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR && micBtn) {
      recognition = new SR();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => { listening = true; if (statusEl) statusEl.textContent = 'Listening…'; if (micBtn) micBtn.style.background = 'linear-gradient(135deg, rgba(124,156,255,.35), rgba(103,232,249,.35))'; };
      recognition.onerror = (ev) => { if (statusEl) statusEl.textContent = 'Mic error. Check permissions.'; console.warn('SpeechRecognition error', ev); };
      recognition.onend = () => { listening = false; if (statusEl) statusEl.textContent = ''; if (micBtn) micBtn.style.background = ''; };

      recognition.onresult = (e) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        inputEl.value = transcript;
        autoResize();
      };

      micBtn.addEventListener('mousedown', () => { try { recognition.start(); } catch (e) { /* ignore */ } });
      micBtn.addEventListener('mouseup', () => { if (listening) recognition.stop(); });
      micBtn.addEventListener('click', () => { try { if (!listening) recognition.start(); else recognition.stop(); } catch (e) { /* ignore */ } });
    } else {
      if (micBtn) { micBtn.disabled = true; micBtn.title = 'Speech Recognition not supported'; }
    }
  } catch (err) {
    console.warn('Speech setup failed', err);
    if (micBtn) micBtn.disabled = true;
  }

  // ===== Buttons: clear, export, theme =====
  const clearBtn = $('#clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear this conversation?')) {
        localStorage.removeItem(STORAGE_KEY);
        messagesEl.innerHTML = '';
        addMessage('Conversation cleared. Start fresh! ✨', 'bot');
      }
    });
  }

  const exportBtn = $('#exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const lines = [...messagesEl.children].map(n => {
        const who = n.classList.contains('user') ? 'You' : 'Bot';
        // innerText gives readable text (strips HTML)
        const text = n.innerText.replace(/\n+/g, '\n');
        return `[${who}] ${text}`;
      }).join('\n\n');
      const blob = new Blob([lines], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const light = document.body.dataset.theme === 'light';
      document.body.dataset.theme = light ? '' : 'light';
      if (!light) {
        document.documentElement.style.setProperty('--bg', '#eef2ff');
        document.documentElement.style.setProperty('--panel', 'rgba(0,0,0,0.04)');
        document.documentElement.style.setProperty('--panel-2', 'rgba(0,0,0,0.08)');
        document.documentElement.style.setProperty('--text', '#0b1020');
        document.documentElement.style.setProperty('--muted', '#556080');
        document.documentElement.style.setProperty('--shadow', '0 10px 30px rgba(0,0,0,.08), inset 0 0 0 1px rgba(0,0,0,.06)');
      } else {
        document.documentElement.style.setProperty('--bg', '#0b1020');
        document.documentElement.style.setProperty('--panel', 'rgba(255,255,255,0.06)');
        document.documentElement.style.setProperty('--panel-2', 'rgba(255,255,255,0.12)');
        document.documentElement.style.setProperty('--text', '#e9eefb');
        document.documentElement.style.setProperty('--muted', '#9aa4c7');
        document.documentElement.style.setProperty('--shadow', '0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.06)');
      }
    });
  }

  // ===== Init =====
  restore();
  if (messagesEl.children.length === 0) {
    addMessage('Welcome! Type a message or press 🎤 to speak. This demo uses a local fake bot. Try: "asthma for baby" or "cold for baby".', 'bot');
  }
});
