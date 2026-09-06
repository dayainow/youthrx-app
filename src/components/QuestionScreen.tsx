import { useState, useEffect, useRef, useCallback } from 'react';
import type { UserEmotion, UserState, UserConcern } from '../hooks/usePrescription';
import { Sun, Meh, BatteryWarning, Moon, Briefcase, Home, Wallet, Heart, BookOpen, Target, Building2, Rocket, Coffee } from 'lucide-react';
import useSound from 'use-sound';
import mapoLogo from '../assets/mapo_logo.png';

interface Props {
  step: number;
  userName: string;
  setUserName: (name: string) => void;
  userEmotion: UserEmotion | null;
  setUserEmotion: (emotion: UserEmotion) => void;
  userState: UserState | null;
  setUserState: (state: UserState) => void;
  userConcern: UserConcern | null;
  setUserConcern: (concern: UserConcern) => void;
  onNext: () => void;
  onPrescribe: (concern: UserConcern, state: UserState, emotion: UserEmotion) => void;
}

type Message = {
  id: string;
  sender: 'pharmacist' | 'user';
  text: string;
};

export const QuestionScreen = ({ step, userName, setUserName, userEmotion, setUserEmotion, setUserState, userConcern, setUserConcern, onNext, onPrescribe }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [tempName, setTempName] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepProcessed = useRef<Set<number>>(new Set());

  // Play a soft pop sound
  const [playPop] = useSound('https://actions.google.com/sounds/v1/ui/pop.ogg', { volume: 0.5 });
  const [playReceive] = useSound('https://actions.google.com/sounds/v1/water/water_drip.ogg', { volume: 0.2 });

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, showOptions]);

  const addPharmacistMessage = useCallback((text: string, delay = 0, triggerOptions = false) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        playReceive();
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'pharmacist', text }]);
        if (triggerOptions) setShowOptions(true);
      }, 1000); // typing duration
    }, delay);
  }, [playReceive]);

  useEffect(() => {
    // Prevent React 18 StrictMode double-execution
    if (stepProcessed.current.has(step)) return;
    stepProcessed.current.add(step);

    if (step === 2) {
      addPharmacistMessage("어서오세요, 마포 마음약국입니다.", 0);
      addPharmacistMessage("처방전에 기록할 이름을 알려주시겠어요?", 1200, true);
    } else if (step === 3) {
      addPharmacistMessage(`반갑습니다, ${userName}님.`, 500);
      addPharmacistMessage("오늘 하루, 어떤 기분으로 보내셨나요?", 2000, true);
    } else if (step === 4) {
      addPharmacistMessage("그렇군요... 조금 지칠 수도 있는 날이었네요.", 500);
      addPharmacistMessage("지금 마음을 가장 무겁게 하는 짐은 무엇인가요?", 2000, true);
    } else if (step === 5) {
      addPharmacistMessage("충분히 이해합니다. 혼자 고민이 많으셨겠어요.", 500);
      addPharmacistMessage("마지막으로, 당신의 현재 상황을 들려주시겠어요?", 2000, true);
    }
  }, [step, userName, addPharmacistMessage]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    if (navigator.vibrate) navigator.vibrate(50);
    playPop();
    setShowOptions(false);
    
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: tempName }]);
    
    setTimeout(() => {
      setUserName(tempName);
      onNext();
    }, 600);
  };

  const handleOptionSelect = (type: 'emotion' | 'concern' | 'state', value: string, text: string) => {
    if (!showOptions) return;
    if (navigator.vibrate) navigator.vibrate(50);
    playPop();
    setShowOptions(false);
    
    // Add user message
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text }]);
    
    // Proceed to next step
    setTimeout(() => {
      if (type === 'emotion') {
        setUserEmotion(value as UserEmotion);
        onNext();
      } else if (type === 'concern') {
        setUserConcern(value as UserConcern);
        onNext();
      } else if (type === 'state') {
        setUserState(value as UserState);
        onPrescribe(userConcern!, value as UserState, userEmotion!);
      }
    }, 600);
  };

  const emotions = [
    { val: '완벽해', icon: <Sun className="w-5 h-5 text-orange-500" />, text: '완벽해요! 갓생 성공' },
    { val: '그저 그래', icon: <Meh className="w-5 h-5 text-slate-500" />, text: '그냥저냥 무난한 하루였어요' },
    { val: '지쳤어', icon: <BatteryWarning className="w-5 h-5 text-red-400" />, text: '갓생 살기에 너무 지쳐버림...' },
    { val: '우울해', icon: <Moon className="w-5 h-5 text-indigo-400" />, text: '아무것도 안 했는데 벌써 저녁이야' }
  ];

  const concerns = [
    { val: '취업', icon: <Briefcase className="w-5 h-5 text-blue-500" />, text: '취업·진로 고민' },
    { val: '주거', icon: <Home className="w-5 h-5 text-emerald-500" />, text: '주거·독립 비용' },
    { val: '금융', icon: <Wallet className="w-5 h-5 text-yellow-500" />, text: '통장을 스쳐가는 생활비' },
    { val: '마음', icon: <Heart className="w-5 h-5 text-rose-500" />, text: '번아웃 직전의 마음 상태' }
  ];

  const states = [
    { val: '대학생', icon: <BookOpen className="w-5 h-5 text-indigo-500" />, text: '과제와 시험에 치이는 대학생' },
    { val: '취업준비생', icon: <Target className="w-5 h-5 text-red-500" />, text: '자소설 쓰느라 밤새는 취준생' },
    { val: '직장인', icon: <Building2 className="w-5 h-5 text-slate-600" />, text: '출근하자마자 퇴근하고 싶은 직장인' },
    { val: '프리랜서', icon: <Rocket className="w-5 h-5 text-orange-500" />, text: '프리랜서 / N잡러 / 창업가' },
    { val: '휴식', icon: <Coffee className="w-5 h-5 text-amber-600" />, text: '잠시 쉼표를 찍고 숨 고르는 중' }
  ];

  return (
    <div className="flex-1 flex flex-col relative z-20 h-full min-h-0 bg-[#F7F5F0]">
      {/* Chat Area */}
      <div 
        ref={scrollRef} 
        className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 md:space-y-5 scrollbar-hide ${
          !showOptions
            ? 'pb-8'
            : step === 2
              ? 'pb-28 md:pb-36'
              : step === 5
                ? 'pb-[25rem] md:pb-[20rem]'
                : 'pb-[22rem] md:pb-[15rem]'
        }`}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.sender === 'pharmacist' && (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center mr-2 md:mr-3 shrink-0 shadow-sm border border-[#E8E1D5] overflow-hidden">
                <img src={mapoLogo} alt="약사" className="w-full h-full object-contain p-1" />
              </div>
            )}
            <div 
              className={`max-w-[78%] md:max-w-[68%] p-3.5 md:px-5 md:py-4 rounded-2xl text-[14px] md:text-base leading-relaxed break-keep shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#3E3A39] text-white rounded-tr-sm' 
                  : 'bg-white text-[#3E3A39] rounded-tl-sm border border-[#E8E1D5]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center mr-2 md:mr-3 shrink-0 shadow-sm border border-[#E8E1D5] overflow-hidden">
              <img src={mapoLogo} alt="약사" className="w-full h-full object-contain p-1" />
            </div>
            <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm border border-[#E8E1D5] shadow-sm flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Options Area (Bottom Fixed) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E1D5] p-4 md:p-6 transition-transform duration-500 z-30 ${showOptions ? 'translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]' : 'translate-y-full'}`}>
        
        {step === 2 && (
          <form onSubmit={handleNameSubmit} className="flex gap-2 md:gap-3 md:max-w-[620px] md:mx-auto">
            <input 
              type="text" 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="이름 또는 별명을 입력해주세요" 
              className="min-w-0 flex-1 bg-[#FAF8F2] border border-[#E8E1D5] rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-[#3E3A39] md:text-base focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 transition-colors"
              maxLength={10}
            />
            <button 
              type="submit"
              disabled={!tempName.trim()}
              className="bg-[#8B4513] text-white px-6 md:px-10 py-3.5 md:py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#703810] transition-colors"
            >
              확인
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 max-h-[40vh] overflow-y-auto scrollbar-hide pb-2 md:pb-0">
            {emotions.map(({val, icon, text}) => (
              <button 
                key={val}
                onClick={() => handleOptionSelect('emotion', val, text)}
                className="w-full min-h-[60px] md:min-h-[72px] bg-[#FAF8F2] border border-[#E8E1D5] hover:border-[#8B4513] rounded-xl p-3.5 md:p-4 transition-all flex items-center gap-3 active:scale-[0.98]"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
                <span className="text-[#3E3A39] font-bold text-[14px] md:text-base flex-1 text-left break-keep">{text}</span>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 max-h-[40vh] overflow-y-auto scrollbar-hide pb-2 md:pb-0">
            {concerns.map(({val, icon, text}) => (
              <button 
                key={val}
                onClick={() => handleOptionSelect('concern', val, text)}
                className="w-full min-h-[60px] md:min-h-[72px] bg-[#FAF8F2] border border-[#E8E1D5] hover:border-[#8B4513] rounded-xl p-3.5 md:p-4 transition-all flex items-center gap-3 active:scale-[0.98]"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
                <span className="text-[#3E3A39] font-bold text-[14px] md:text-base flex-1 text-left break-keep">{text}</span>
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 max-h-[44vh] overflow-y-auto scrollbar-hide pb-2 md:pb-0">
            {states.map(({val, icon, text}) => (
              <button 
                key={val}
                onClick={() => handleOptionSelect('state', val, text)}
                className="w-full min-h-[60px] md:min-h-[72px] md:last:col-span-2 bg-[#FAF8F2] border border-[#E8E1D5] hover:border-[#8B4513] rounded-xl p-3.5 md:p-4 transition-all flex items-center gap-3 active:scale-[0.98]"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
                <span className="text-[#3E3A39] font-bold text-[14px] md:text-base flex-1 text-left break-keep">{text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
