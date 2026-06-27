# DSA Visualizer

An interactive, beginner-friendly visualizer for common Data Structures and Algorithms, built with React, Vite, and Tailwind CSS.

## What it covers

**Sorting**
- Bubble Sort
- Selection Sort
- Insertion Sort

**Searching**
- Linear Search
- Binary Search

**Data Structures**
- Stack (LIFO)
- Queue (FIFO)

## Features

- Step-by-step visualization with animated bar charts and box diagrams
- Auto-play mode or manual step-forward / step-back controls
- Live pseudocode panel with the active line highlighted as you step through
- Complexity badge (time & space) for every algorithm
- Beginner explanation panel describing what is happening at each step
- Custom number input — type any list of numbers separated by commas or spaces
- Search target input for Linear and Binary Search

## Tech stack

| Tool | Purpose |
|------|---------|
| React 19 | UI and state management |
| Vite 5 | Dev server and bundler |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |

## Getting started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project structure

```
dsa-visualizer/
├── Src/
│   ├── App.jsx        # All algorithm logic and UI components
│   ├── main.jsx       # React entry point
│   └── index.css      # Tailwind directives
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## How to use

1. Pick an algorithm from the dropdown on the left.
2. Enter your own numbers in the **Input numbers** field (comma or space separated).
3. For search algorithms, set the **Search target** value.
4. Click **Run** to generate steps, then use **Next / Previous** to walk through them one at a time, or **Auto Play** to animate automatically.
5. Watch the pseudocode panel — the currently executing line is highlighted in blue.
