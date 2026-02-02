import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 15, y: y * 15 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToTools = () => {
    const element = document.getElementById('tools');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #f4f6ff 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #a3b7ff 0%, transparent 70%)',
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4 text-[#6b8cff]" />
              <span className="text-sm font-medium text-[#6b8cff]">
                免费在线PDF转换工具
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              轻松转换
              <span className="block bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] bg-clip-text text-transparent">
                PDF文档
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              轻松将您的PDF转换为Word、Excel、PowerPoint等格式。支持多种格式互转，
              操作简单，转换快速，保持原始格式不变。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button
                size="lg"
                onClick={scrollToTools}
                className="bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] text-white hover:opacity-90 shadow-xl shadow-blue-200 group"
              >
                开始转换
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                了解更多
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 animate-in fade-in duration-700 delay-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10M+</div>
                <div className="text-sm text-gray-500">用户信赖</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">转换格式</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500">成功率</div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Illustration */}
          <div
            ref={imageRef}
            className="relative flex items-center justify-center lg:justify-end animate-in fade-in slide-in-from-right-10 duration-1000 delay-200"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              className="relative w-full max-w-lg transition-transform duration-200 ease-out"
              style={{
                transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
              }}
            >
              <img
                src="/hero-illustration.png"
                alt="PDF Conversion"
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  animation: 'float 6s ease-in-out infinite',
                }}
              />

              {/* Floating Elements */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center"
                style={{
                  animation: 'float 4s ease-in-out infinite 0.5s',
                }}
              >
                <span className="text-2xl font-bold text-[#6b8cff]">W</span>
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center"
                style={{
                  animation: 'float 5s ease-in-out infinite 1s',
                }}
              >
                <span className="text-2xl font-bold text-green-500">X</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </section>
  );
}
