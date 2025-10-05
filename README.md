# 🚀 LegStrong - Space Habitat Design System

An interactive space habitat design tool for students and professionals, combining AI-powered component generation with real-time 3D visualization and NASA guideline validation.

![Habitat Design System](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.2-yellow) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-blue)

## 🌟 Features

### 🎯 Mission-Driven Design
- **Mission Parameters**: Configure location, destination, duration, crew size, and mission type
- **Launch Vehicle Selection**: Choose from SLS, Falcon Heavy, Starship, Vulcan, and New Glenn
- **Mission Phases**: Support for surface operations, transit, orbital, and mixed operations

### 🏗️ Habitat Geometry Design
- **Multiple Shapes**: Sphere, Cylinder, and Cuboid habitats
- **Adjustable Dimensions**: Real-time dimension controls with sliders
- **Color Customization**: Full color picker for habitat visualization
- **Quick Presets**: Pre-configured habitat sizes (Small Lab, Research Station, etc.)

### 🤖 AI-Powered Component Generation
- **Gemini AI Integration**: Uses Google's Gemini 2.0 Flash model for intelligent component suggestions
- **NASA Guidelines**: Follows established space habitat design standards
- **Dynamic Specifications**: Components generated based on mission requirements
- **Functional Areas**: 12+ functional areas including ECLS, crew quarters, labs, and storage

### 📊 Real-Time Analysis
- **Quantitative Metrics**: Volume utilization, area per person, and capacity calculations
- **Compliance Validation**: Checks against NASA minimum requirements
- **Functional Allocation**: Ensures proper distribution of space (sleep, hygiene, work, etc.)
- **Zoning Rules**: Validates adjacency requirements and noise/privacy constraints

### 🎨 3D Visualization
- **Interactive 3D Models**: Rotate, zoom, and inspect habitat designs
- **Component Placement**: Visual layout of functional areas
- **Real-Time Updates**: Instant visualization of design changes

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini 2.0 Flash API
- **Database**: Supabase (for mission/design storage)
- **3D Rendering**: Three.js integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key
- Supabase account (optional, for data persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/legstrong.git
   cd legstrong
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### 1. Define Mission Parameters
- Select your mission location and destination
- Set crew size and mission duration
- Choose launch vehicle and mission phase
- Specify mission type (exploration, research, construction, maintenance)

### 2. Design Habitat Geometry
- Choose habitat shape (Sphere, Cylinder, or Cuboid)
- Adjust dimensions using sliders:
  - **Sphere**: Radius (1-50m)
  - **Cylinder**: Radius (1-20m) and Height (1-50m)
  - **Cuboid**: Width, Depth, and Height (1-50m each)
- Select habitat color
- Use quick presets for common configurations

### 3. Generate Components
- Click "Generate Habitat Design" to trigger AI component generation
- Gemini AI analyzes your mission parameters
- Receives component specifications following NASA guidelines
- Components include volume, area, mass, power requirements

### 4. Review and Analyze
- **Habitat Preview**: Visual representation with volume and capacity
- **Quantitative Analysis**: Utilization metrics and compliance checks
- **Functional Areas**: Detailed breakdown of space allocation
- **3D Visualization**: Interactive 3D model of the complete habitat

### 5. Validate Design
- Real-time validation against NASA requirements
- Area and volume compliance per functional area
- Adjacency rule checking
- Design recommendations and warnings

## 🏛️ Architecture

### Core Components

```
src/
├── components/
│   ├── MissionForm.tsx          # Mission parameter input
│   ├── HabitatControls.tsx      # Geometry design controls
│   ├── HabitatVisualization.tsx # 2D habitat preview
│   ├── Habitat3DView.tsx        # 3D habitat visualization
│   ├── FunctionalAreaDesigner.tsx # Area placement tool
│   ├── QuantitativeAnalysis.tsx # Metrics and validation
│   ├── AssemblyView.tsx         # Component assembly view
│   └── ValidationPanel.tsx      # Compliance checking
├── hooks/
│   └── useHabitatGeneration.ts  # AI generation logic
├── types/
│   ├── functionalAreas.ts       # NASA functional area definitions
│   └── index.ts                 # TypeScript type definitions
└── lib/
    └── supabase.ts              # Database integration
```

### Data Flow

1. **User Input** → MissionForm captures parameters
2. **Geometry Design** → HabitatControls manages shape/dimensions
3. **AI Generation** → useHabitatGeneration calls Gemini API
4. **Component Processing** → Parse and validate AI response
5. **Visualization** → Render 3D model and analysis
6. **Validation** → Check compliance with NASA guidelines

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | No |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | No |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

### Functional Areas

The system includes 12 functional areas based on NASA guidelines:

- **Life Support**: ECLS, Waste Management
- **Crew Support**: Sleep, Hygiene, Exercise
- **Operations**: Galley, Communication, Control
- **Maintenance**: Maintenance, Power Systems
- **Science**: Science Lab, Medical Bay
- **Storage**: General Storage, Food Storage

Each area has defined minimum requirements for area and volume per person.

## 🎯 NASA Guidelines Implementation

### Volume Requirements
- Short missions (<60 days): 25 m³/crew minimum
- Long missions (>60 days): 50-70 m³/crew
- Mars missions: 37 m³/crew target

### Functional Allocation
- Sleep/Private: 20-30%
- Hygiene: 10-15%
- Work/Lab: 15-20%
- Medical/Exercise: 10%
- Storage: 15-20%

### Zoning Rules
- Clean areas (sleep, galley, science, medical) grouped together
- Dirty areas (hygiene, exercise, waste) separated
- Sleep ≠ Hygiene ≠ Exercise
- Proper adjacency relationships maintained

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Hosting Platform
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For providing comprehensive habitat design guidelines
- **Google**: For the Gemini AI API
- **Supabase**: For database infrastructure
- **Three.js**: For 3D visualization capabilities

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Contact the maintainers
- Check the documentation in `llm.md` for detailed technical specifications

---

**Built with ❤️ for the future of space exploration**
