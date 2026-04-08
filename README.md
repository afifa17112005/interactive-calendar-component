# Interactive Wall Calendar Component

A polished, highly interactive, and responsive React/Next.js component inspired by a physical wall calendar aesthetic. It features dynamic seasonal themes, an integrated memo system, a range selection functionality, and beautifully crafted SVGs.

## Features

- **Wall Calendar Aesthetic:** Clean design integrating a hero image section that perfectly offsets the calendar functionality, emulating a physical calendar layout.
- **Dynamic Seasonal Backgrounds & SVGs:** The side panel changes background color and artistic geometric SVG representations for different months and seasons (e.g., snowflakes for Jan/Dec, sprouts for March, suns for Summer).
- **Day Range Selector:** Enables picking a start date and an end date with a live preview while hovering.
- **Integrated Notes System:** Allows adding notes specifically attached to the selected date range. Notes show up in an indicator on the specific days across the grid.
- **Fully Responsive & Fluid UX:** Silky-smooth rendering with animated transitions when changing months, built with standard vanilla CSS rules stringed onto an intuitive layout that collapses gracefully on mobile.

## How to run locally

1. Ensure you have Node.js installed.
2. Navigate to this directory in your terminal: \`cd calendar\`
3. Install dependencies: \`npm install\`
4. Run the development server: \`npm run dev\`
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Component Architecture

- **Self-contained Styling**: Uses stringed CSS injected locally so the component operates completely independent of any global styling engine.
- **Performance optimizations**: Extensively leverages \`useMemo\` and \`useCallback\` hooks to recalculate grids, range sets, and events to avoid unnecessary re-renders. 
- **Sub-Component Logic**: Uses independent \`DayCell\` sub-components to handle fast internal hover state and hover logic decoupled from the parent to maximize rendering performance.
