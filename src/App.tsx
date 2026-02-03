import './App.css';
import Navbar from './sections/Navbar';
// TODO: 后期需要时取消注释
// import Hero from './sections/Hero';
import ConversionTools from './sections/ConversionTools';
// TODO: 后期需要时取消注释
// import Features from './sections/Features';
// import CTA from './sections/CTA';
// import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* TODO: Hero - 后期需要时取消注释
        <Hero />
        */}
        <ConversionTools />
        {/* TODO: 后期需要时取消注释
        <Features />
        <CTA />
        */}
      </main>
      {/* TODO: Footer - 后期需要时取消注释
      <Footer />
      */}
    </div>
  );
}

export default App;
