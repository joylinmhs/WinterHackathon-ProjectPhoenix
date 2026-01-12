import { useState } from "react";

function FirstAidTips() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const firstAidTips = [
    {
      id: 1,
      category: "wounds",
      title: "Cuts and Wounds",
      emergency: "For minor cuts:",
      steps: [
        "Clean the wound with soap and water",
        "Apply pressure with a clean cloth to stop bleeding",
        "Cover with a sterile bandage",
        "Change dressing daily and watch for signs of infection"
      ],
      urgent: "For deep wounds or heavy bleeding: Apply pressure and seek immediate medical help"
    },
    {
      id: 2,
      category: "burns",
      title: "Burns",
      emergency: "For minor burns:",
      steps: [
        "Cool the burn under running water for 10-15 minutes",
        "Remove jewelry or tight clothing near the burn",
        "Cover loosely with a clean cloth",
        "Do not apply creams, oils, or ice"
      ],
      urgent: "For severe burns (blisters, white/charred skin): Seek immediate medical attention"
    },
    {
      id: 3,
      category: "choking",
      title: "Choking",
      emergency: "Adult choking:",
      steps: [
        "Encourage coughing",
        "If coughing fails, perform abdominal thrusts (Heimlich maneuver)",
        "Alternate between 5 back blows and 5 abdominal thrusts",
        "Call emergency services if person becomes unconscious"
      ],
      urgent: "If person stops responding: Start CPR and call emergency services"
    },
    {
      id: 4,
      category: "heart",
      title: "Heart Attack",
      emergency: "Signs: Chest pain, shortness of breath, nausea",
      steps: [
        "Call emergency services immediately",
        "Help person sit or lie down comfortably",
        "Loosen tight clothing",
        "If trained, perform CPR if person becomes unconscious",
        "Give aspirin if available and not allergic"
      ],
      urgent: "Call emergency services immediately - time is critical"
    },
    {
      id: 5,
      category: "stroke",
      title: "Stroke",
      emergency: "Signs: Sudden numbness, confusion, trouble speaking, vision problems",
      steps: [
        "Call emergency services immediately",
        "Note the time symptoms started",
        "Help person lie down with head slightly elevated",
        "Do not give food or drink",
        "Monitor breathing and consciousness"
      ],
      urgent: "Call emergency services immediately - FAST: Face, Arms, Speech, Time"
    },
    {
      id: 6,
      category: "fractures",
      title: "Broken Bones",
      emergency: "For suspected fractures:",
      steps: [
        "Keep the injured area still and supported",
        "Apply ice wrapped in cloth to reduce swelling",
        "Elevate the injured area if possible",
        "Do not try to realign the bone yourself"
      ],
      urgent: "For open fractures or severe pain: Seek immediate medical attention"
    },
    {
      id: 7,
      category: "poisoning",
      title: "Poisoning",
      emergency: "If someone has been poisoned:",
      steps: [
        "Call poison control or emergency services immediately",
        "Do not induce vomiting unless instructed",
        "Save the container/pill bottle",
        "Monitor breathing and consciousness"
      ],
      urgent: "Call emergency services immediately - do not wait for symptoms"
    },
    {
      id: 8,
      category: "allergic",
      title: "Severe Allergic Reaction",
      emergency: "Signs: Difficulty breathing, swelling, hives",
      steps: [
        "Call emergency services immediately",
        "Help person sit upright",
        "Use EpiPen if available and person is trained",
        "Remove sting if applicable",
        "Begin CPR if person stops breathing"
      ],
      urgent: "Call emergency services immediately - can be life-threatening"
    }
  ];

  const categories = [
    { id: "all", name: "All Tips", icon: "📚" },
    { id: "wounds", name: "Wounds", icon: "🩹" },
    { id: "burns", name: "Burns", icon: "🔥" },
    { id: "choking", name: "Choking", icon: "😮" },
    { id: "heart", name: "Heart", icon: "❤️" },
    { id: "stroke", name: "Stroke", icon: "🧠" },
    { id: "fractures", name: "Fractures", icon: "🦴" },
    { id: "poisoning", name: "Poisoning", icon: "☠️" },
    { id: "allergic", name: "Allergies", icon: "🤧" }
  ];

  const filteredTips = firstAidTips.filter(tip => {
    const matchesCategory = selectedCategory === "all" || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.emergency.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#ff9800", marginBottom: "20px" }}>🚑 First Aid Tips</h2>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search for emergency situations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginBottom: "15px"
          }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: "8px 16px",
                border: selectedCategory === category.id ? "2px solid #ff9800" : "1px solid #ccc",
                borderRadius: "20px",
                backgroundColor: selectedCategory === category.id ? "#fff3e0" : "#ffffff",
                color: selectedCategory === category.id ? "#ff9800" : "#666",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: selectedCategory === category.id ? "bold" : "normal"
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tips List */}
      <div style={{ display: "grid", gap: "15px" }}>
        {filteredTips.map(tip => (
          <div key={tip.id} style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: "18px" }}>
              {tip.title}
            </h3>

            <div style={{ marginBottom: "15px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#ff9800", fontSize: "16px" }}>
                📋 Emergency Response:
              </h4>
              <p style={{ margin: "0", color: "#555", lineHeight: "1.6" }}>
                {tip.emergency}
              </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#27ae60", fontSize: "16px" }}>
                ✅ Steps to Take:
              </h4>
              <ol style={{ margin: "0", paddingLeft: "20px", color: "#555", lineHeight: "1.8" }}>
                {tip.steps.map((step, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>{step}</li>
                ))}
              </ol>
            </div>

            <div style={{
              backgroundColor: "#ffeaea",
              border: "1px solid #ffcccc",
              borderRadius: "6px",
              padding: "12px",
              marginTop: "15px"
            }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#d32f2f", fontSize: "14px" }}>
                🚨 When to Seek Urgent Medical Help:
              </h4>
              <p style={{ margin: "0", color: "#d32f2f", fontWeight: "bold" }}>
                {tip.urgent}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#666",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          marginTop: "20px"
        }}>
          <h3>No tips found</h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}

export default FirstAidTips;