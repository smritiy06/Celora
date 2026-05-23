import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  BookOpen,
  Bot,
  Moon,
  Target,
  Calendar,
  ArrowRight,
} from "lucide-react";

const coreFeatures = [
  {
    icon: BookOpen,
    title: "Study Roadmaps",
    desc: "Personalized learning paths built around your goals.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Monitor streaks, completed topics and analytics.",
  },
  {
    icon: Calendar,
    title: "Study Planner",
    desc: "Smart scheduling and timetable organization.",
  },
  {
    icon: Moon,
    title: "Dark / Light Mode",
    desc: "Modern responsive interface across all devices.",
  },
];

const aiFeatures = [
  {
    icon: Bot,
    title: "AI Tutor",
    desc: "Ask doubts, get explanations and simplified concepts.",
  },
  {
    icon: Brain,
    title: "AI Quiz Generator",
    desc: "Generate quizzes from topics, notes or syllabus.",
  },
  {
    icon: Target,
    title: "Weak Topic Detection",
    desc: "AI identifies weak areas from learning patterns.",
  },
];

function App() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-purple-950 text-white">

    {/* Navbar */}
    <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">

      <h1 className="text-3xl font-bold">
        CE<span className="text-purple-500">LORA</span>
      </h1>

      <div className="hidden md:flex gap-8 text-zinc-300">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">Dashboard</a>
      </div>

      <button className="px-5 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 transition">
        Login
      </button>

    </nav>

    {/* Hero */}
    <section className="px-8 py-24 text-center">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-black leading-tight"
      >
        Learn Smarter <br />
        with <span className="text-purple-500">AI</span>
      </motion.h1>
      <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.3, duration: 0.8 }}
  className="max-w-5xl mx-auto mt-20"
>

  <div className="bg-white/5 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl">

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-zinc-900/70 rounded-3xl p-6">
        <h3 className="text-zinc-400 text-sm">
          Study Progress
        </h3>

        <p className="text-4xl font-bold text-purple-400 mt-4">
          87%
        </p>
      </div>

      <div className="bg-zinc-900/70 rounded-3xl p-6">
        <h3 className="text-zinc-400 text-sm">
          AI Accuracy
        </h3>

        <p className="text-4xl font-bold text-purple-400 mt-4">
          94%
        </p>
      </div>

      <div className="bg-zinc-900/70 rounded-3xl p-6">
        <h3 className="text-zinc-400 text-sm">
          Daily Streak
        </h3>

        <p className="text-4xl font-bold text-purple-400 mt-4">
          21 Days
        </p>
      </div>

    </div>

  </div>

</motion.div>

      <p className="mt-8 text-zinc-400 text-xl max-w-2xl mx-auto">
        Personalized learning, AI tutoring, quizzes,
        analytics and smart revision — all in one platform.
      </p>
<div className="mt-10 flex justify-center gap-4 flex-wrap">

  <button className="px-8 py-4 bg-purple-600 rounded-2xl hover:scale-105 hover:bg-purple-700 transition flex items-center gap-2">
    Start Learning
    <ArrowRight size={18} />
  </button>

  <button className="px-8 py-4 border border-zinc-700 rounded-2xl hover:border-purple-500 transition">
    View Demo
  </button>

</div>
    </section>
    {/* Core Features */}

<section className="px-8 py-24 max-w-7xl mx-auto">

  <h2 className="text-5xl font-bold text-center mb-16">
    Core Features
  </h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

    {coreFeatures.map((feature, index) => {
      const Icon = feature.icon;

      return (
        <motion.div
          key={index}
          whileHover={{ y: -8 }}
          className="bg-white/5 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8"
        >

          <Icon
            className="text-purple-400 mb-6"
            size={36}
          />

          <h3 className="text-2xl font-bold">
            {feature.title}
          </h3>

          <p className="text-zinc-400 mt-4">
            {feature.desc}
          </p>

        </motion.div>
      );
    })}

  </div>
  {/* AI Features */}

<section className="px-8 py-24 max-w-7xl mx-auto">

  <h2 className="text-5xl font-bold text-center mb-16">
    AI Features
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {aiFeatures.map((feature, index) => {
      const Icon = feature.icon;

      return (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-xl"
        >

          <Icon
            className="text-purple-400 mb-6"
            size={40}
          />

          <h3 className="text-2xl font-bold">
            {feature.title}
          </h3>

          <p className="text-zinc-400 mt-4">
            {feature.desc}
          </p>

        </motion.div>
      );
    })}

  </div>

</section>
{/* Testimonials */}

<section className="px-8 py-24 max-w-7xl mx-auto">

  <h2 className="text-5xl font-bold text-center mb-16">
    What Students Say
  </h2>

  <div className="grid md:grid-cols-2 gap-8">

    <div className="bg-white/5 border border-zinc-800 rounded-3xl p-8">
      <p className="text-zinc-300 text-lg">
        “Celora completely transformed my study routine.
        The AI tutor feels like having a personal mentor.”
      </p>

      <h3 className="mt-6 text-purple-400 font-bold">
        — Smriti
      </h3>
    </div>

    <div className="bg-white/5 border border-zinc-800 rounded-3xl p-8">
      <p className="text-zinc-300 text-lg">
        “The quizzes, analytics and smart revision system
        helped me improve way faster.”
      </p>

      <h3 className="mt-6 text-purple-400 font-bold">
        — Ansh
      </h3>
    </div>

  </div>

</section>

{/* Final CTA */}

<section className="px-8 pb-24 text-center">

  <h2 className="text-6xl font-black">
    Start Learning Smarter
  </h2>

  <p className="text-zinc-400 mt-6 text-xl">
    Join the future of AI-powered education.
  </p>

  <button className="mt-10 px-10 py-4 bg-purple-600 rounded-2xl hover:scale-105 transition">
    Get Started
  </button>

</section>
</section>

  </div>
)
}
export default App;