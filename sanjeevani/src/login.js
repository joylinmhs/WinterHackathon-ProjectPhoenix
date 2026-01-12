import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Login({ setLoggedIn }) {
  const [step, setStep] = useState("roleSelection"); // roleSelection, adminPassword
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const ADMIN_PASSWORD = "admin123";

  const handleUserClick = () => {
    setActiveRole("user");
    // Add a small delay for the animation
    setTimeout(() => setLoggedIn("user"), 400);
  };

  const handleAdminClick = () => {
    setActiveRole("admin");
    setTimeout(() => {
      setStep("adminPassword");
      setActiveRole(null);
    }, 400);
  };

  const handleAdminPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate async check
    setTimeout(() => {
      if (adminPassword === ADMIN_PASSWORD) {
        setLoggedIn("admin");
      } else {
        setError("Incorrect password. Please try again.");
        setAdminPassword("");
      }
      setLoading(false);
    }, 800);
  };

  const handleBackClick = () => {
    setStep("roleSelection");
    setAdminPassword("");
    setError("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans overflow-hidden text-gray-100">
      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 overflow-hidden items-center justify-center p-12 border-r border-slate-800">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 mix-blend-screen"
        />

        <div className="relative z-10 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="mb-8 inline-block"
          >
            <div className="text-8xl mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">🏥</div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Sanjeevani
            </h1>
            <p className="text-2xl font-light text-blue-200 mb-8 tracking-wide">
              Smart Emergency Hospital Finder
            </p>
            <div className="h-1 w-24 bg-blue-500/50 mx-auto rounded-full mb-8 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto">
              Connecting patients with emergency medical assistance in critical moments.
              Secure, reliable, and life-saving technology when it matters most.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Interactive Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {step === "roleSelection" ? (
              <motion.div
                key="roleSelection"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-800 rounded-3xl shadow-2xl shadow-black/50 p-8 md:p-10 border border-slate-700"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
                  <p className="text-slate-400">Please select your role to continue</p>
                </div>

                <div className="space-y-5">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUserClick}
                    className={`w-full p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 group text-left
                      ${activeRole === 'user'
                        ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10'}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors
                      ${activeRole === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                      👤
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold transition-colors ${activeRole === 'user' ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}`}>
                        Patient Access
                      </h3>
                      <p className="text-sm text-gray-500 group-hover:text-gray-400">Find emergency assistance nearby</p>
                    </div>
                  </motion.button>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdminClick}
                    className={`w-full p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 group text-left
                      ${activeRole === 'admin'
                        ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10'}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors
                      ${activeRole === 'admin' ? 'bg-red-500 text-white' : 'bg-slate-700 text-red-400 group-hover:bg-red-500 group-hover:text-white'}`}>
                      🏥
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold transition-colors ${activeRole === 'admin' ? 'text-red-400' : 'text-gray-200 group-hover:text-white'}`}>
                        Hospital Admin
                      </h3>
                      <p className="text-sm text-gray-500 group-hover:text-gray-400">Manage resources and requests</p>
                    </div>
                  </motion.button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-slate-500">By continuing, you agree to our Terms of Service</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="adminPassword"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-800 rounded-3xl shadow-2xl shadow-black/50 p-8 md:p-10 border border-slate-700"
              >
                <button
                  onClick={handleBackClick}
                  className="mb-8 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <span className="mr-2">←</span> Back to Role Selection
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 text-red-500 border border-red-500/20">
                    🔐
                  </div>
                  <h2 className="text-2xl font-bold text-white">Admin Authentication</h2>
                  <p className="text-slate-400 mt-2">Secure access area</p>
                </div>

                <form onSubmit={handleAdminPasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter admin key..."
                        value={adminPassword}
                        required
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-300 font-medium"
                        autoFocus
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl flex items-center"
                      >
                        <span className="text-xl mr-3">⚠️</span>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-red-500/20 transition-all duration-300
                      ${loading
                        ? 'bg-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : "Unlock Dashboard"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 text-center w-full">
          <p className="text-slate-600 text-sm font-medium">© 2026 Sanjeevani Project</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
