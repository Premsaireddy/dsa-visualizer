import React, { useMemo, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, StepForward, StepBack, Search, Layers, List, ArrowRightLeft, Zap } from "lucide-react";

const algorithms = [
  { id: "bubble", name: "Bubble Sort", type: "sort" },
  { id: "selection", name: "Selection Sort", type: "sort" },
  { id: "insertion", name: "Insertion Sort", type: "sort" },
  { id: "linear", name: "Linear Search", type: "search" },
  { id: "binary", name: "Binary Search", type: "search" },
  { id: "stack", name: "Stack", type: "structure" },
  { id: "queue", name: "Queue", type: "structure" },
];

const details = {
  bubble: {
    complexity: "Time: O(n²), Space: O(1)",
    idea: "Bubble Sort compares nearby values and swaps them if they are in the wrong order. Bigger values slowly move to the end.",
    pseudo: [
      "for i from 0 to n - 1",
      "  for j from 0 to n - i - 2",
      "    if arr[j] > arr[j + 1]",
      "      swap arr[j] and arr[j + 1]",
    ],
  },
  selection: {
    complexity: "Time: O(n²), Space: O(1)",
    idea: "Selection Sort finds the smallest value from the unsorted part and places it at the correct position.",
    pseudo: [
      "for i from 0 to n - 1",
      "  minIndex = i",
      "  for j from i + 1 to n - 1",
      "    if arr[j] < arr[minIndex]",
      "      minIndex = j",
      "  swap arr[i] and arr[minIndex]",
    ],
  },
  insertion: {
    complexity: "Time: O(n²), Space: O(1)",
    idea: "Insertion Sort builds a sorted section one element at a time by inserting each value into its correct position.",
    pseudo: [
      "for i from 1 to n - 1",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key",
      "    arr[j + 1] = arr[j]",
      "    j--",
      "  arr[j + 1] = key",
    ],
  },
  linear: {
    complexity: "Time: O(n), Space: O(1)",
    idea: "Linear Search checks each value from left to right until the target is found or the array ends.",
    pseudo: [
      "for i from 0 to n - 1",
      "  if arr[i] == target",
      "    return i",
      "return -1",
    ],
  },
  binary: {
    complexity: "Time: O(log n), Space: O(1)",
    idea: "Binary Search works on sorted data. It checks the middle value and removes half of the search space each step.",
    pseudo: [
      "left = 0, right = n - 1",
      "while left <= right",
      "  mid = floor((left + right) / 2)",
      "  if arr[mid] == target return mid",
      "  else if arr[mid] < target left = mid + 1",
      "  else right = mid - 1",
    ],
  },
  stack: {
    complexity: "Push: O(1), Pop: O(1), Space: O(n)",
    idea: "A Stack follows LIFO: Last In, First Out. The most recently inserted item is removed first.",
    pseudo: [
      "push(value): add value to top",
      "pop(): remove top value",
      "peek(): read top value",
      "isEmpty(): check if stack has no items",
    ],
  },
  queue: {
    complexity: "Enqueue: O(1), Dequeue: O(1), Space: O(n)",
    idea: "A Queue follows FIFO: First In, First Out. The earliest inserted item is removed first.",
    pseudo: [
      "enqueue(value): add value to rear",
      "dequeue(): remove value from front",
      "front(): read first value",
      "isEmpty(): check if queue has no items",
    ],
  },
};

function parseInput(input) {
  return input
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((x) => !Number.isNaN(x));
}

function makeStep(array, explanation, active = [], sorted = [], found = null, codeLine = 0, extra = {}) {
  return { array: [...array], explanation, active, sorted, found, codeLine, ...extra };
}

function bubbleSortSteps(input) {
  const arr = [...input];
  const steps = [makeStep(arr, "Start Bubble Sort. Compare neighbouring values.", [], [], null, 0)];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push(makeStep(arr, `Compare ${arr[j]} and ${arr[j + 1]}.`, [j, j + 1], [], null, 1));
      if (arr[j] > arr[j + 1]) {
        const [bigger, smaller] = [arr[j], arr[j + 1]];
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push(makeStep(arr, `Swap: ${bigger} > ${smaller}, so move ${bigger} right.`, [j, j + 1], [], null, 3));
      }
    }
    steps.push(makeStep(arr, `Position ${arr.length - i - 1} is now fixed.`, [], Array.from({ length: i + 1 }, (_, k) => arr.length - 1 - k), null, 0));
  }
  steps.push(makeStep(arr, "Array is fully sorted.", [], arr.map((_, i) => i), null, 0));
  return steps;
}

function selectionSortSteps(input) {
  const arr = [...input];
  const steps = [makeStep(arr, "Start Selection Sort. Find the minimum value for each position.", [], [], null, 0)];
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    steps.push(makeStep(arr, `Assume index ${i} is the minimum.`, [i], Array.from({ length: i }, (_, k) => k), null, 1));
    for (let j = i + 1; j < arr.length; j++) {
      steps.push(makeStep(arr, `Compare current minimum ${arr[minIndex]} with ${arr[j]}.`, [minIndex, j], Array.from({ length: i }, (_, k) => k), null, 2));
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push(makeStep(arr, `New minimum found: ${arr[minIndex]}.`, [minIndex], Array.from({ length: i }, (_, k) => k), null, 4));
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    steps.push(makeStep(arr, `Swap minimum value into position ${i}.`, [i, minIndex], Array.from({ length: i + 1 }, (_, k) => k), null, 5));
  }
  steps.push(makeStep(arr, "Array is fully sorted.", [], arr.map((_, i) => i), null, 0));
  return steps;
}

function insertionSortSteps(input) {
  const arr = [...input];
  const steps = [makeStep(arr, "Start Insertion Sort. Build a sorted section from left to right.", [], [0], null, 0)];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push(makeStep(arr, `Take ${key} and insert it into the sorted left section.`, [i], Array.from({ length: i }, (_, k) => k), null, 1));
    while (j >= 0 && arr[j] > key) {
      steps.push(makeStep(arr, `${arr[j]} is greater than ${key}, so shift ${arr[j]} right.`, [j, j + 1], Array.from({ length: i }, (_, k) => k), null, 3));
      arr[j + 1] = arr[j];
      j--;
      steps.push(makeStep(arr, "Value shifted one position to the right.", [j + 1], Array.from({ length: i }, (_, k) => k), null, 4));
    }
    arr[j + 1] = key;
    steps.push(makeStep(arr, `Insert ${key} into its correct position.`, [j + 1], Array.from({ length: i + 1 }, (_, k) => k), null, 5));
  }
  steps.push(makeStep(arr, "Array is fully sorted.", [], arr.map((_, i) => i), null, 0));
  return steps;
}

function linearSearchSteps(input, target) {
  const steps = [makeStep(input, `Start Linear Search for target ${target}.`, [], [], null, 0)];
  for (let i = 0; i < input.length; i++) {
    steps.push(makeStep(input, `Check index ${i}: value ${input[i]}.`, [i], [], null, 1));
    if (input[i] === target) {
      steps.push(makeStep(input, `Target ${target} found at index ${i}.`, [i], [], i, 2));
      return steps;
    }
  }
  steps.push(makeStep(input, `Target ${target} was not found.`, [], [], -1, 3));
  return steps;
}

function binarySearchSteps(input, target) {
  const arr = [...input].sort((a, b) => a - b);
  const steps = [makeStep(arr, `Binary Search needs sorted data. Searching for ${target}.`, [], [], null, 0, { left: 0, right: arr.length - 1 })];
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(makeStep(arr, `Middle index is ${mid}, value is ${arr[mid]}.`, [mid], [], null, 2, { left, right }));
    if (arr[mid] === target) {
      steps.push(makeStep(arr, `Target ${target} found at index ${mid}.`, [mid], [], mid, 3, { left, right }));
      return steps;
    }
    if (arr[mid] < target) {
      left = mid + 1;
      steps.push(makeStep(arr, `${arr[mid]} is smaller than ${target}. Search right half.`, [], [], null, 4, { left, right }));
    } else {
      right = mid - 1;
      steps.push(makeStep(arr, `${arr[mid]} is greater than ${target}. Search left half.`, [], [], null, 5, { left, right }));
    }
  }
  steps.push(makeStep(arr, `Target ${target} was not found.`, [], [], -1, 1, { left, right }));
  return steps;
}

function stackSteps(input) {
  const stack = [];
  const steps = [makeStep(stack, "Start with an empty stack.", [], [], null, 0)];
  input.forEach((value) => {
    stack.push(value);
    steps.push(makeStep(stack, `Push ${value}. It goes on the top of the stack.`, [stack.length - 1], [], null, 0));
  });
  while (stack.length) {
    const top = stack[stack.length - 1];
    steps.push(makeStep(stack, `Top value is ${top}. Pop removes this value first.`, [stack.length - 1], [], null, 1));
    stack.pop();
    steps.push(makeStep(stack, `Popped ${top}.`, [], [], null, 1));
  }
  return steps;
}

function queueSteps(input) {
  const queue = [];
  const steps = [makeStep(queue, "Start with an empty queue.", [], [], null, 0)];
  input.forEach((value) => {
    queue.push(value);
    steps.push(makeStep(queue, `Enqueue ${value}. It joins at the rear of the queue.`, [queue.length - 1], [], null, 0));
  });
  while (queue.length) {
    const front = queue[0];
    steps.push(makeStep(queue, `Front value is ${front}. Dequeue removes this value first.`, [0], [], null, 1));
    queue.shift();
    steps.push(makeStep(queue, `Dequeued ${front}.`, [], [], null, 1));
  }
  return steps;
}

function createSteps(algorithm, input, target) {
  if (!input.length) return [makeStep([], "Please enter numbers first.")];
  switch (algorithm) {
    case "bubble": return bubbleSortSteps(input);
    case "selection": return selectionSortSteps(input);
    case "insertion": return insertionSortSteps(input);
    case "linear": return linearSearchSteps(input, target);
    case "binary": return binarySearchSteps(input, target);
    case "stack": return stackSteps(input);
    case "queue": return queueSteps(input);
    default: return [makeStep(input, "Choose an algorithm.")];
  }
}

function BarVisualizer({ step, mode }) {
  const max = Math.max(...step.array, 1);
  if (mode === "stack" || mode === "queue") {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl bg-slate-50 p-6">
        <div className="flex items-end gap-3">
          {step.array.length === 0 ? <p className="text-slate-500">Empty</p> : step.array.map((value, index) => (
            <div key={index} className={`flex h-14 min-w-14 items-center justify-center rounded-xl border text-lg font-bold shadow-sm ${step.active.includes(index) ? "scale-110 border-indigo-500 bg-indigo-100 text-indigo-700" : "border-slate-200 bg-white text-slate-700"}`}>
              {value}
            </div>
          ))}
        </div>
        {step.array.length > 0 && (
          mode === "stack"
            ? <p className="text-xs font-medium text-slate-400">← BOTTOM &nbsp;|&nbsp; TOP →</p>
            : <p className="text-xs font-medium text-slate-400">DEQUEUE ← FRONT &nbsp;&nbsp; REAR → ENQUEUE</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-72 items-end justify-center gap-2 rounded-2xl bg-slate-50 p-6">
      {step.array.map((value, index) => {
        const active = step.active.includes(index);
        const sorted = step.sorted.includes(index);
        const found = step.found === index;
        return (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`flex w-10 items-end justify-center rounded-t-xl text-xs font-bold text-white transition-all duration-300 sm:w-14 ${found ? "bg-emerald-500" : sorted ? "bg-green-500" : active ? "bg-indigo-500" : "bg-slate-400"}`}
              style={{ height: `${Math.max(35, (value / max) * 220)}px` }}
            >
              <span className="mb-2">{value}</span>
            </div>
            <span className="text-xs text-slate-500">{index}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [algorithm, setAlgorithm] = useState("bubble");
  const [inputText, setInputText] = useState("8, 3, 5, 1, 9, 2");
  const [targetText, setTargetText] = useState("5");
  const [steps, setSteps] = useState(() => bubbleSortSteps([8, 3, 5, 1, 9, 2]));
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);

  const selected = algorithms.find((item) => item.id === algorithm);
  const info = details[algorithm];
  const step = steps[current] || steps[0];

  const numbers = useMemo(() => parseInput(inputText), [inputText]);
  const target = Number(targetText);

  useEffect(() => {
    if (!playing) return;
    if (current >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrent((x) => x + 1), speed);
    return () => clearTimeout(timer);
  }, [playing, current, steps.length, speed]);

  function run() {
    const nextSteps = createSteps(algorithm, numbers, target);
    setSteps(nextSteps);
    setCurrent(0);
    setPlaying(false);
  }

  function reset() {
    setCurrent(0);
    setPlaying(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-4 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">Beginner DSA Visualizer</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Learn algorithms step by step</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Enter custom input, run an algorithm, move through each step, and understand what is happening visually.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-4"><Search className="mx-auto mb-1" /><p className="text-sm">Search</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><ArrowRightLeft className="mx-auto mb-1" /><p className="text-sm">Sort</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><Layers className="mx-auto mb-1" /><p className="text-sm">DS</p></div>
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <label className="text-sm font-semibold text-slate-700">Choose algorithm</label>
            <select value={algorithm} onChange={(e) => { const a = e.target.value; setAlgorithm(a); setPlaying(false); setSteps(createSteps(a, numbers, target)); setCurrent(0); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-indigo-300">
              {algorithms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>

            <label className="mt-5 block text-sm font-semibold text-slate-700">Input numbers</label>
            <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Example: 5, 2, 9, 1" className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-300" />
            <p className="mt-1 text-xs text-slate-500">Use commas or spaces between numbers.</p>

            {(algorithm === "linear" || algorithm === "binary") && (
              <>
                <label className="mt-5 block text-sm font-semibold text-slate-700">Search target</label>
                <input value={targetText} onChange={(e) => setTargetText(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-300" />
              </>
            )}

            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-700">Speed</label>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-slate-500">Slow</span>
                <input type="range" min={200} max={2000} step={100} value={2200 - speed} onChange={(e) => setSpeed(2200 - Number(e.target.value))} className="w-full accent-indigo-600" />
                <span className="text-xs text-slate-500">Fast</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={run} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"><Zap size={18} />Run</button>
              <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-200"><RotateCcw size={18} />Reset</button>
              <button onClick={() => setCurrent((x) => Math.max(0, x - 1))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-200"><StepBack size={18} />Previous</button>
              <button onClick={() => setCurrent((x) => Math.min(steps.length - 1, x + 1))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-200"><StepForward size={18} />Next</button>
              <button onClick={() => setPlaying(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"><Play size={18} />Auto Play</button>
              <button onClick={() => setPlaying(false)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-100 px-4 py-3 font-semibold text-rose-700 hover:bg-rose-200"><Pause size={18} />Pause</button>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-600">Step {current + 1} of {steps.length}</p>
                    {current === steps.length - 1 && steps.length > 1 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Completed</span>
                    )}
                  </div>
                </div>
                <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">{info.complexity}</div>
              </div>
              <BarVisualizer step={step} mode={selected.type === "structure" ? selected.id : "array"} />
              <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-sm uppercase tracking-wide text-indigo-200">Explanation</p>
                <p className="mt-1 text-lg font-medium">{step.explanation}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-bold"><List size={20} /> Pseudocode</h3>
                <div className="space-y-2">
                  {info.pseudo.map((line, index) => (
                    <div key={line} className={`rounded-xl px-3 py-2 font-mono text-sm ${step.codeLine === index ? "bg-indigo-100 text-indigo-800" : "bg-slate-50 text-slate-700"}`}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-3 text-xl font-bold">Beginner explanation</h3>
                <p className="leading-7 text-slate-600">{info.idea}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">Current array / data</p>
                  <p className="mt-2 break-words font-mono text-slate-800">[{step.array.join(", ")}]</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
