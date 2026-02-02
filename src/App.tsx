import './App.css';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import ConversionTools from './sections/ConversionTools';
import Features from './sections/Features';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ConversionTools />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
