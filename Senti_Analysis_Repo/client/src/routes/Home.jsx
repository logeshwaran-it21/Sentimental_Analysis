// import { useState } from "react";
// import FormButton from "../components/FormButton";
// import confetti from "canvas-confetti";
// import "../styles/home.css";

// export default function Home() {
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [sentiment, setSentiment] = useState(null);

//   // Trigger confetti effect
//   const celebrate = () => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
//   };

//   // Handle form submission
//   async function handleSubmit(event) {
//     event.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch("/api/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message);

//       // Update sentiment state
//       setSentiment(data.sentiment);
//       setHistory([...history, { text, sentiment: data.sentiment }]);

//       // Celebrate on positive sentiment
//       if (data.sentiment === "positive") celebrate();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="app-container dark:bg-gray-900">
//       <h1 className="project-heading text-3xl font-bold text-center text-white">
//         Sentiment Analyzer
//       </h1>
//       {loading && <div className="spinner"></div>}

//       <form
//         className="py-16 max-w-2xl mx-auto flex-col flex gap-8 bg-gray-800 rounded-lg p-6"
//         onSubmit={handleSubmit}
//       >
//         <div>
//           <label
//             htmlFor="text"
//             className="block mb-2 text-sm font-medium text-gray-200"
//           >
//             Enter Text
//           </label>
//           <textarea
//             value={text}
//             onChange={(event) => setText(event.target.value)}
//             id="text"
//             className="bg-gray-700 border-gray-600 border rounded-lg block w-full p-2.5 text-gray-400 focus:outline-none min-h-[150px]"
//             required
//           />
//         </div>
//         <FormButton text="Analyse Sentiment" />

//         <div className="flex gap-8 justify-center mt-4">
//           {sentiment === "positive" && (
//             <div className="result-box highlight-positive text-center">
//               <h2 className="text-3xl text-green-400">Positive 😊</h2>
//             </div>
//           )}
//           {sentiment === "negative" && (
//             <div className="result-box highlight-negative text-center">
//               <h2 className="text-3xl text-red-400">Negative 😢</h2>
//             </div>
//           )}
//         </div>
//       </form>

//       <div className="history bg-gray-800 p-4 rounded-lg mt-8 max-w-2xl mx-auto">
//         <h2 className="text-2xl font-medium text-gray-200 mb-4">
//           Analysis History
//         </h2>
//         {history.length > 0 ? (
//           history.map((item, index) => (
//             <div
//               key={index}
//               className="history-item bg-gray-700 p-3 rounded-md mb-2"
//             >
//               <p className="text-gray-300">
//                 <strong>Text:</strong> {item.text}
//               </p>
//               <p className="text-gray-300">
//                 <strong>Sentiment:</strong> {item.sentiment}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">No analysis history yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// Home.jsx
import { useState } from "react";
import FormButton from "../components/FormButton";
import confetti from "canvas-confetti";
import "../styles/home.css";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sentiment, setSentiment] = useState(null);

  // Trigger confetti effect
  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update sentiment state
      setSentiment(data.sentiment);
      setHistory([...history, { text, sentiment: data.sentiment }]);

      // Save history to the database
      await fetch("/api/analysis-history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is stored
        },
        body: JSON.stringify({ text, sentiment: data.sentiment }),
      });

      // Celebrate on positive sentiment
      if (data.sentiment === "positive") celebrate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container dark:bg-gray-900">
      <h1 className="project-heading text-3xl font-bold text-center text-white">
        Sentiment Analyzer
      </h1>
      {loading && <div className="spinner"></div>}

      <form
        className="py-16 max-w-2xl mx-auto flex-col flex gap-8 bg-gray-800 rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-200"
          >
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            id="text"
            className="bg-gray-700 border-gray-600 border rounded-lg block w-full p-2.5 text-gray-400 focus:outline-none min-h-[150px]"
            required
          />
        </div>
        <FormButton text="Analyse Sentiment" />

        <div className="flex gap-8 justify-center mt-4">
          {sentiment === "positive" && (
            <div className="result-box highlight-positive text-center">
              <h2 className="text-3xl text-green-400">Positive 😊</h2>
            </div>
          )}
          {sentiment === "negative" && (
            <div className="result-box highlight-negative text-center">
              <h2 className="text-3xl text-red-400">Negative 😢</h2>
            </div>
          )}
        </div>
      </form>

      <div className="history bg-gray-800 p-4 rounded-lg mt-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium text-gray-200 mb-4">
          Analysis History
        </h2>
        {history.length > 0 ? (
          history.map((item, index) => (
            <div
              key={index}
              className="history-item bg-gray-700 p-3 rounded-md mb-2"
            >
              <p className="text-gray-300">
                <strong>Text:</strong> {item.text}
              </p>
              <p className="text-gray-300">
                <strong>Sentiment:</strong> {item.sentiment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No analysis history yet.</p>
        )}
      </div>
    </div>
  );
}
