import { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Lock, Globe, Clock, Award } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '极速转换',
    description: '采用先进的转换引擎，秒级完成文档转换，大幅提升工作效率',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '所有文件使用SSL加密传输，转换后自动删除，保护您的隐私',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Lock,
    title: '隐私保护',
    description: '我们重视您的数据安全，不会保存或分享您的任何文件内容',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: Globe,
    title: '云端处理',
    description: '无需安装软件，浏览器即可完成所有操作，支持所有平台',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Clock,
    title: '24/7服务',
    description: '随时随地使用我们的服务，没有时间和地域限制',
    color: 'from-red-400 to-rose-500',
  },
  {
    icon: Award,
    title: '高质量输出',
    description: '保持原始文档的格式和排版，确保转换后的文件质量',
    color: 'from-indigo-400 to-violet-500',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('.feature-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-50 to-transparent opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-[#6b8cff] text-sm font-medium mb-4">
            为什么选择我们
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            专业可靠的PDF转换服务
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们致力于提供最优质的文档转换体验，让您的办公更加高效便捷
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleItems.has(index);

            return (
              <div
                key={index}
                data-index={index}
                className={`feature-item group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#6b8cff]/20 hover:shadow-xl transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#6b8cff] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50M+', label: '文档转换' },
            { value: '10M+', label: '活跃用户' },
            { value: '99.9%', label: '满意度' },
            { value: '24/7', label: '技术支持' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#f4f6ff] to-white"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
