
import React, { useState } from 'react';
import { UserData, AnalysisResult } from './types';
import { analyzeNumerology } from './services/geminiService';
import LoadingScreen from './components/LoadingScreen';
import IndicatorCard from './components/IndicatorCard';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({ fullName: '', birthDate: '', intention: '' });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('intro');

  const handleStart = () => setStep('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.fullName || !userData.birthDate) return;
    
    setLoading(true);
    try {
      const result = await analyzeNumerology(userData);
      setAnalysis(result);
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("Tần số đang bận. Hãy thử lại sau giây lát.");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdownText = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      const cleanParagraph = paragraph.replace(/\*\*/g, '').trim();
      if (cleanParagraph.startsWith('##')) {
        return (
          <h3 
            key={i} 
            className="text-[13px] md:text-[15px] tracking-[0.35em] uppercase text-gray-900 font-black mb-6 mt-14 text-center"
          >
            {cleanParagraph.replace('##', '').trim()}
          </h3>
        );
      }
      return (
        <p 
          key={i} 
          className="mb-8 text-gray-800 leading-[2.1] md:leading-[2.3] font-medium tracking-[0.01em] text-left md:text-justify text-lg md:text-xl max-w-3xl mx-auto"
        >
          {cleanParagraph}
        </p>
      );
    });
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen selection:bg-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[38rem] h-[38rem] bg-emerald-50 rounded-full blur-3xl opacity-70 -top-56 -left-40" />
        <div className="absolute w-[32rem] h-[32rem] bg-indigo-50 rounded-full blur-3xl opacity-60 -bottom-48 -right-28" />
        <div className="absolute w-[18rem] h-[18rem] bg-white border border-gray-100 rounded-full opacity-40 blur-3xl top-24 right-[35%]" />
      </div>

      <div className="relative z-10">
      {/* Introduction View */}
      {step === 'intro' && (
        <div className="h-screen flex flex-col items-center justify-center text-center px-6 fade-in">
          <div className="max-w-4xl">
            <div className="mb-16">
               <div className="w-[1px] h-24 bg-gray-200 mx-auto mb-8" />
               <h2 className="text-[12px] md:text-[13px] tracking-[0.9em] uppercase text-gray-600 font-black">
                 Mind Color Map
               </h2>
            </div>
            <p className="text-2xl md:text-3xl font-light leading-[2.1] md:leading-[2.4] mb-20 text-gray-900 tracking-tight px-4">
              "Trân trọng chào đón bạn. Hãy cùng tôi khám phá bản đồ tâm thức qua lăng kính Thần số học và tần số năng lượng. Chúng ta sẽ cùng chuyển hóa mọi áp lực thành sức mạnh, đưa rung động của bạn về trạng thái thấu hiểu và yêu thương thuần khiết."
            </p>
            <button 
              onClick={handleStart}
              className="group relative px-20 py-6 overflow-hidden rounded-full border border-gray-200 transition-all duration-1000 hover:border-gray-900 shadow-sm bg-white/70 backdrop-blur"
            >
              <span className="relative z-10 text-[11px] tracking-[0.8em] uppercase text-gray-600 group-hover:text-gray-900 transition-colors font-black">
                Bắt đầu hành trình
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Form View */}
      {step === 'form' && (
        <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 fade-in">
          <div className="w-full max-w-2xl bg-white/85 border border-gray-100 rounded-[2rem] p-12 shadow-xl shadow-gray-200/30 backdrop-blur">
            <h2 className="text-[12px] tracking-[0.8em] uppercase text-gray-600 mb-14 text-center font-black">
              Thiết lập thông số rung động
            </h2>
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-[0.45em] text-gray-700 font-black block ml-1">Danh xưng đầy đủ</label>
                <input 
                  required
                  type="text"
                  placeholder="Vd: Nguyễn Hoàng Nam"
                  className="w-full px-3 py-5 border-b-2 border-gray-100 focus:border-gray-900 outline-none transition-all duration-700 text-xl font-medium tracking-widest bg-white/40 placeholder:text-gray-300 rounded-xl"
                  value={userData.fullName}
                  onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-[0.45em] text-gray-700 font-black block ml-1">Thời khắc hiện diện</label>
                <input 
                  required
                  type="date"
                  className="w-full px-3 py-5 border-b-2 border-gray-100 focus:border-gray-900 outline-none transition-all duration-700 text-xl font-medium tracking-widest bg-white/40 rounded-xl"
                  value={userData.birthDate}
                  onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-[0.45em] text-gray-700 font-black block ml-1">Câu hỏi tâm thức</label>
                <textarea 
                  placeholder="Bạn đang tìm kiếm điều gì trong hành trình này?"
                  rows={2}
                  className="w-full px-3 py-5 border-b-2 border-gray-100 focus:border-gray-900 outline-none transition-all duration-700 text-lg font-medium tracking-widest bg-white/40 resize-none placeholder:text-gray-300 rounded-xl"
                  value={userData.intention}
                  onChange={(e) => setUserData({...userData, intention: e.target.value})}
                />
              </div>
              <div className="pt-10">
                <button 
                  type="submit"
                  className="w-full py-7 bg-gray-900 text-white rounded-full text-[12px] tracking-[0.8em] uppercase hover:bg-black transition-all shadow-2xl shadow-gray-200 font-black"
                >
                  Giải mã bản đồ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Result View */}
      {step === 'result' && analysis && (
        <div className="bg-white min-h-screen px-6 py-24 fade-in">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-28 grid lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2 text-center lg:text-left">
                <span className="text-[11px] md:text-[12px] tracking-[0.9em] uppercase text-gray-500 font-black mb-10 block">
                  The Vibration of {userData.fullName}
                </span>
                <h1 className="text-3xl md:text-5xl font-light text-gray-900 leading-[1.7] max-w-5xl mx-auto lg:mx-0 mb-10 tracking-tight px-4 lg:px-0">
                  {analysis.introduction}
                </h1>
                <p className="text-base md:text-lg font-medium text-gray-600 italic max-w-3xl leading-[2.1] tracking-[0.05em] px-6 lg:px-0 mx-auto lg:mx-0">
                  {analysis.mainColorDescription}
                </p>
              </div>

              <div className="bg-white/85 border border-gray-100 rounded-[28px] p-8 shadow-xl shadow-gray-200/30 backdrop-blur space-y-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl border border-gray-100 shadow-inner"
                    style={{ backgroundColor: `${analysis.mainColorHex}1A`, boxShadow: `0 10px 35px ${analysis.mainColorHex}33` }}
                  />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 font-black">Màu chủ đạo</p>
                    <p className="text-lg font-semibold" style={{ color: analysis.mainColorHex }}>{analysis.mainColorHex}</p>
                  </div>
                </div>

                {userData.intention && (
                  <div className="border border-gray-100 rounded-2xl p-4 bg-white/60">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-black mb-2">Câu hỏi tâm thức</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{userData.intention}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs uppercase text-gray-500 font-black">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: analysis.mainColorHex }} />
                    <span className="tracking-[0.25em]">Main Tone</span>
                  </div>
                  <div className="text-right tracking-[0.2em]">{userData.birthDate}</div>
                </div>
              </div>
            </div>

            {/* Indicator Grid */}
            <div className="mb-48">
              <div className="flex flex-col items-center mb-20 space-y-4">
                <h2 className="text-[14px] tracking-[0.8em] uppercase text-gray-900 font-black">
                  Hệ thống 21 tần số năng lượng
                </h2>
                <div className="w-16 h-[2px] bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {analysis.indicators.map((indicator, idx) => (
                  <IndicatorCard 
                    key={idx} 
                    indicator={indicator} 
                  />
                ))}
              </div>
            </div>

            {/* Deep Reading Section */}
            <div className="max-w-5xl mx-auto mb-48 relative">
              <div className="absolute -left-16 -top-20 text-[15rem] text-gray-50 font-serif opacity-30 select-none pointer-events-none">“</div>
              <div className="px-6 relative z-10 bg-white/80 border border-gray-100 rounded-[32px] shadow-xl shadow-gray-200/30 backdrop-blur-lg py-12">
                {renderMarkdownText(analysis.fullReading)}
              </div>
              <div className="absolute -right-16 -bottom-40 text-[15rem] text-gray-50 font-serif opacity-30 select-none pointer-events-none rotate-180">“</div>
            </div>

            {/* Final Blessing */}
            <div className="text-center py-32 border-t-2 border-gray-50">
              <div className="mb-16 flex justify-center">
                 <div className="w-4 h-4 rounded-full bg-gray-100 animate-ping" />
              </div>
              <p className="text-2xl font-light italic text-gray-600 mb-20 tracking-[0.2em] max-w-4xl mx-auto leading-relaxed px-6">
                {analysis.blessing}
              </p>
              <button 
                onClick={() => setStep('intro')}
                className="group text-[12px] tracking-[0.8em] uppercase text-gray-500 hover:text-gray-900 transition-all duration-700 flex items-center gap-6 mx-auto font-black"
              >
                <span className="w-12 h-[2px] bg-gray-100 group-hover:w-24 group-hover:bg-gray-900 transition-all duration-700"></span>
                Khởi đầu hành trình mới
                <span className="w-12 h-[2px] bg-gray-100 group-hover:w-24 group-hover:bg-gray-900 transition-all duration-700"></span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default App;
