# Daawat Rice Challenge Awareness Dashboard - React

A comprehensive and modern admin dashboard built with React, TypeScript, and Bootstrap. Features a professional dark theme with advanced data visualization and management capabilities.

## ✨ Features

### 📊 Dashboard Analytics
- Real-time data visualization with ApexCharts
- Interactive widgets and metrics
- Performance monitoring and KPIs
- Responsive charts and graphs

### 🎨 UI/UX Excellence
- Custom rice grain animation background
- Responsive layout for all devices
- Bootstrap-powered components
- Iconify icon integration

### 📱 Multi-Section Management
- **Web Management**: Challenges and Diet Planning
- **Social Analytics**: Performance tracking, Hashtag analysis, Stories management
- **Recipe System**: View and Create rice-based recipes
- **Overall Performance**: Comprehensive analytics dashboard

### 🛠️ Development Features
- TypeScript for type safety
- React 18+ with modern hooks
- Vite for fast development and building
- ESLint configuration
- Hot Module Replacement (HMR)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd TS
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
# or
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
# or
yarn build
# or
bun run build
```

## 📁 Project Structure

```
src/
├── app/(admin)/              # Admin dashboard pages
│   ├── dashboards/          # Main dashboard
│   ├── challenges/          # Challenge management  
│   ├── diet-plan/           # Diet planning system
│   ├── social/              # Social media analytics
│   │   ├── analytics/       # Social analytics
│   │   ├── hashtag-performance/ # Hashtag tracking
│   │   ├── interactions/    # User interactions
│   │   └── stories/         # Stories management
│   ├── recipes/             # Recipe management
│   │   ├── view/            # Recipe viewing
│   │   └── create/          # Recipe creation
│   └── overall-performance/ # Performance metrics
├── components/              # Reusable UI components
│   ├── RiceAnimation.tsx    # Custom background animation
│   ├── layout/              # Layout components
│   └── wrapper/             # Provider wrappers
├── assets/                  # Static assets and data
│   ├── data/                # Menu items and mock data
│   ├── images/              # Image assets
│   └── scss/                # Styling files
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
├── context/                 # React context providers
└── routes/                  # Routing configuration
```

## 🎯 Key Features

### Navigation System
- **Dashboard**: Main analytics and overview
- **Web**: Challenges and Diet Plan management
- **Social**: Analytics, Hashtag Performance, Interactions, Stories
- **Recipes**: View and Create recipe management
- **Overall Performance**: Comprehensive performance metrics

### Technical Highlights
- **Canvas Animation**: Custom falling rice grain animation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Professional dark interface throughout
- **Type Safety**: Full TypeScript implementation
- **Modern React**: Hooks, Context, and latest patterns
- **Chart Integration**: ApexCharts for data visualization

## 🔧 Technology Stack

- **Frontend**: React 18+ with TypeScript
- **UI Framework**: Bootstrap with custom SCSS
- **Icons**: Iconify icon library  
- **Charts**: ApexCharts for data visualization
- **Routing**: React Router v6
- **Build Tool**: Vite with HMR
- **Styling**: SCSS with component-based architecture
- **Package Manager**: npm/yarn/bun support

## 📊 Development Tools

### ESLint Configuration
The project includes a comprehensive ESLint setup for TypeScript and React:

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Theming
- Modify colors in `src/assets/scss/config/`
- Update component styles in `src/assets/scss/components/`
- Customize layout in `src/assets/scss/structure/`

### Menu Configuration
Update navigation items in `src/assets/data/menu-items.ts`

### Animation Settings
Customize the rice animation in `src/components/RiceAnimation.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is available under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Bootstrap for the UI components
- ApexCharts for data visualization
- Iconify for the comprehensive icon library
- Vite for the fast development experience

---

**Built with ❤️ using React + TypeScript + Vite**
