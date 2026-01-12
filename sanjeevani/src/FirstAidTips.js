import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-slate-900 p-6 md:p-10 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">🚑</span>
            First Aid Tips
          </h2>
          <p className="text-slate-400 text-lg">Essential emergency response guides</p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search for emergency situations (e.g. burn, cut, heart)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-lg text-white placeholder-slate-500 focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.2)] outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 border
                  ${selectedCategory === category.id
                    ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30 transform scale-105"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
              >
                <span>{category.icon}</span> {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tips List */}
        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {filteredTips.map(tip => (
              <motion.div
                layout
                key={tip.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white">{tip.title}</h3>
                    <span className="text-3xl bg-slate-900 p-2 rounded-xl border border-slate-700">
                      {categories.find(c => c.id === tip.category)?.icon || '🆘'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Emergency Response Section */}
                    <div className="bg-orange-900/10 border-l-4 border-orange-500 pl-4 py-1 rounded-r-lg">
                      <h4 className="text-orange-400 font-bold mb-1 flex items-center gap-2">
                        📋 Emergency Response
                      </h4>
                      <p className="text-slate-300">{tip.emergency}</p>
                    </div>

                    {/* Steps Section */}
                    <div>
                      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                        ✅ Steps to Take
                      </h4>
                      <ul className="space-y-2">
                        {tip.steps.map((step, index) => (
                          <li key={index} className="flex gap-3 text-slate-300">
                            <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Urgent Section */}
                    <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex gap-4 items-start">
                      <div className="text-2xl animate-pulse">🚨</div>
                      <div>
                        <h4 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">
                          When to Seek Urgent Help
                        </h4>
                        <p className="text-red-200 font-medium leading-relaxed">
                          {tip.urgent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTips.length === 0 && (
          <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700 mt-10">
            <div className="text-6xl mb-4 grayscale opacity-30">🔍</div>
            <p className="text-slate-500 text-xl font-light">No matching first aid tips found.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
              className="mt-4 text-orange-400 hover:text-orange-300 font-medium underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FirstAidTips;