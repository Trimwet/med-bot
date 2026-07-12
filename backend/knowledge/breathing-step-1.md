---
nodeId: "breathing.step_1"
protocolId: "breathing_difficulty"
protocolVersion: "1.0"
title: "Breathing Difficulty — Initial Assessment"
activationThreshold: 0.80
triageQuestions:
  - "How severe is your breathing difficulty on a scale of 1-10?"
  - "Did this come on suddenly or gradually?"
  - "Do you have any chest pain, wheezing, or coughing?"
severityScale:
  "1-3": "Mild difficulty"
  "4-6": "Moderate difficulty"
  "7-10": "Severe difficulty — struggling to breathe"
redFlags:
  - "sudden onset"
  - "cannot speak full sentences"
  - "blue lips or fingers"
  - "chest pain"
  - "wheezing"
edges:
  - toNodeId: "breathing.step_2_severe"
    label: "severe or sudden breathing difficulty"
  - toNodeId: "breathing.step_2_mild"
    label: "mild to moderate gradual difficulty"
updatedBy: "Dr. Musa (clinical lead)"
---

# Breathing Difficulty Protocol — Step 1

Breathing difficulty is a high-risk symptom that requires careful assessment. Sudden onset or severe difficulty breathing may be a medical emergency requiring immediate attention.

In Nigeria, common causes include asthma exacerbations, pneumonia, COVID-19, and anxiety attacks. The priority is to distinguish emergency causes from non-urgent ones.
