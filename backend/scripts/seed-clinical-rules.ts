// Seed clinical_rules collection with per-protocol thresholds.
// Run with: npx tsx scripts/seed-clinical-rules.ts

import { getDb, COLLECTIONS, closeDb } from "../src/db/client";

const RULES = [
  {
    nodeId: "chest-pain-step-1",
    protocolId: "chest-pain",
    emergencyThreshold: 7,
    seeDoctorThreshold: 4,
    selfCareThreshold: 2,
    triageQuestions: [
      "Where exactly is the pain? Centre of chest, left side, or spreading?",
      "When did it start and how long have you had it?",
      "Does it get worse with breathing, movement, or exertion?",
      "Any sweating, nausea, dizziness, or shortness of breath?",
    ],
    redFlags: [
      "Central crushing chest pain radiating to left arm or jaw",
      "Chest pain with sweating, vomiting, or severe breathlessness",
      "Chest pain that started suddenly and feels tearing",
    ],
  },
  {
    nodeId: "chest-pain-step-2-radiating",
    protocolId: "chest-pain",
    emergencyThreshold: 6,
    seeDoctorThreshold: 3,
    selfCareThreshold: 1,
    triageQuestions: [
      "Is the pain spreading to your arm, jaw, or back?",
      "Are you sweating or feeling sick?",
      "Have you had this pain before?",
    ],
    redFlags: [
      "Pain radiating to left arm with sweating",
      "Sudden onset with tearing sensation",
    ],
  },
  {
    nodeId: "chest-pain-step-2-local",
    protocolId: "chest-pain",
    emergencyThreshold: 7,
    seeDoctorThreshold: 4,
    selfCareThreshold: 2,
    triageQuestions: [
      "Does the pain get worse when you press on the chest wall?",
      "Does it hurt more when you breathe in deeply?",
      "Did it start after physical activity or lifting?",
    ],
    redFlags: [
      "Persistent pain not relieved by rest",
      "Pain with significant breathlessness",
    ],
  },
  {
    nodeId: "fever-step-1",
    protocolId: "fever",
    emergencyThreshold: 8,
    seeDoctorThreshold: 5,
    selfCareThreshold: 3,
    triageQuestions: [
      "What is your temperature reading (if measured)?",
      "How long have you had the fever?",
      "Any headache, body aches, or chills?",
      "Any cough, sore throat, or difficulty breathing?",
    ],
    redFlags: [
      "Temperature above 40°C (104°F) that does not come down",
      "Fever with stiff neck and sensitivity to light",
      "Fever with confusion or difficulty breathing",
      "Fever in a child under 3 months",
    ],
  },
  {
    nodeId: "fever-step-2-mild",
    protocolId: "fever",
    emergencyThreshold: 8,
    seeDoctorThreshold: 5,
    selfCareThreshold: 3,
    triageQuestions: [
      "Is the fever responding to paracetamol or ibuprofen?",
      "Are you able to drink fluids?",
      "Any rash or unusual symptoms?",
    ],
    redFlags: [
      "Fever not responding to medication for more than 3 days",
      "Rash appearing with the fever",
    ],
  },
  {
    nodeId: "fever-step-2-severe",
    protocolId: "fever",
    emergencyThreshold: 7,
    seeDoctorThreshold: 4,
    selfCareThreshold: 2,
    triageQuestions: [
      "How high has the temperature been?",
      "Are you able to keep fluids down?",
      "Any confusion, dizziness, or extreme weakness?",
    ],
    redFlags: [
      "Temperature above 40°C not responding to medication",
      "Confusion or altered consciousness",
      "Inability to keep fluids down for more than 12 hours",
    ],
  },
  {
    nodeId: "breathing-step-1",
    protocolId: "breathing",
    emergencyThreshold: 6,
    seeDoctorThreshold: 3,
    selfCareThreshold: 1,
    triageQuestions: [
      "When did the breathing difficulty start?",
      "Is it constant or does it come and go?",
      "Does anything make it worse (lying down, exercise, dust)?",
      "Any wheezing, cough, chest pain, or fever?",
    ],
    redFlags: [
      "Severe breathlessness at rest or unable to speak in full sentences",
      "Blue lips or fingernails",
      "Breathing difficulty with chest pain or fainting",
      "Sudden onset after exposure to allergen (possible anaphylaxis)",
    ],
  },
  {
    nodeId: "breathing-step-2-mild",
    protocolId: "breathing",
    emergencyThreshold: 6,
    seeDoctorThreshold: 3,
    selfCareThreshold: 1,
    triageQuestions: [
      "Does it get worse with exercise or lying flat?",
      "Any wheezing or cough?",
      "Have you had this before (asthma, COPD)?",
    ],
    redFlags: [
      "Breathing getting progressively worse",
      "Waking up at night gasping for air",
    ],
  },
  {
    nodeId: "breathing-step-2-severe",
    protocolId: "breathing",
    emergencyThreshold: 5,
    seeDoctorThreshold: 2,
    selfCareThreshold: 1,
    triageQuestions: [
      "Are you able to speak in full sentences?",
      "Any bluish discolouration of lips or fingers?",
      "Are you using any breathing inhalers or medications?",
    ],
    redFlags: [
      "Cannot speak more than a few words without pausing",
      "Blue lips or fingers",
      "Accessory muscle use (neck/shoulder muscles visible)",
    ],
  },
];

async function seed() {
  const db = await getDb();
  const col = db.collection(COLLECTIONS.clinicalRules);

  for (const rule of RULES) {
    await col.updateOne(
      { nodeId: rule.nodeId },
      { $set: rule },
      { upsert: true }
    );
    console.log(`✓ seeded rule for ${rule.nodeId}`);
  }

  console.log(`\nDone — ${RULES.length} clinical rules upserted.`);
  await closeDb();
}

seed().catch((err) => {
  console.error("seed failed:", err);
  process.exit(1);
});
