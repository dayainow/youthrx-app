import type { UserEmotion, UserState, UserConcern } from '../hooks/usePrescription';
import {
  Sun, Meh, BatteryWarning, Moon,
  Briefcase, Home, Wallet, Heart,
  BookOpen, Target, Building2, Rocket, Coffee
} from 'lucide-react';

interface Props {
  step: number;
  userEmotion: UserEmotion | null;
  setUserEmotion: (emotion: UserEmotion) => void;
  userState: UserState | null;
  setUserState: (state: UserState) => void;
  userConcern: UserConcern | null;
  setUserConcern: (concern: UserConcern) => void;
  onNext: () => void;
  onPrescribe: (concern: UserConcern, state: UserState, emotion: UserEmotion) => void;
}

export const QuestionScreen = ({ step, userEmotion, setUserEmotion, setUserState, userConcern, setUserConcern, onNext, onPrescribe }: Props) => {
  const getProgress = () => {
    if (step === 2) return 25;
    if (step === 3) return 50;
    return 75;
  };

  const handleEmotionSelect = (emotion: UserEmotion) => {
    setUserEmotion(emotion);
    onNext();
  };

  const handleConcernSelect = (concern: UserConcern) => {
    setUserConcern(concern);
    onNext();
  };

  const handleStateSelect = (state: UserState) => {
    setUserState(state);
    if (userConcern && userEmotion) {
      onPrescribe(userConcern, state, userEmotion);
    }
  };

  // Mappings for Korean 20s trendy/relatable phrasing
  const emotions = [
    { val: '완벽해' as UserEmotion, icon: <Sun className="w-8 h-8 text-orange-500" />, text: '오늘 완전 폼 미쳤다!', desc: '갓생 성공, 찢었다' },
    { val: '그저 그래' as UserEmotion, icon: <Meh className="w-8 h-8 text-slate-500" />, text: '그냥저냥 무난한 하루', desc: '특별할 것 없는 일상' },
    { val: '지쳤어' as UserEmotion, icon: <BatteryWarning className="w-8 h-8 text-red-400" />, text: '갓생 살기에 지쳐버림', desc: '방전 직전, 배터리 1%' },
    { val: '우울해' as UserEmotion, icon: <Moon className="w-8 h-8 text-indigo-400" />, text: '아무것도 안 했는데...', desc: '벌써 저녁이야' }
  ];

  const concerns = [
    { val: '취업' as UserConcern, icon: <Briefcase className="w-6 h-6 text-blue-500" />, title: '취업·진로', desc: '이력서 쓰다가 현타 옴... 내 자리는 어디에?' },
    { val: '주거' as UserConcern, icon: <Home className="w-6 h-6 text-emerald-500" />, title: '주거·독립', desc: '숨만 쉬어도 나가는 월세, 내 집은 어디에?' },
    { val: '금융' as UserConcern, icon: <Wallet className="w-6 h-6 text-yellow-500" />, title: '생활비·금융', desc: '통장을 스쳐가는 월급... 금융치료 시급!' },
    { val: '마음' as UserConcern, icon: <Heart className="w-6 h-6 text-rose-500" />, title: '마음·관계', desc: '번아웃 직전, 아무도 모르는 내 마음 알아주라' }
  ];

  const states = [
    { val: '대학생' as UserState, icon: <BookOpen className="w-5 h-5 text-indigo-500" />, text: '과제와 시험에 치이는 대학생' },
    { val: '취업준비생' as UserState, icon: <Target className="w-5 h-5 text-red-500" />, text: '자소설 쓰느라 밤새는 취준생' },
    { val: '직장인' as UserState, icon: <Building2 className="w-5 h-5 text-slate-600" />, text: '출근하자마자 퇴근하고 싶은 직장인' },
    { val: '프리랜서' as UserState, icon: <Rocket className="w-5 h-5 text-orange-500" />, text: '프리랜서 / N잡러 / 창업가' },
    { val: '휴식' as UserState, icon: <Coffee className="w-5 h-5 text-amber-600" />, text: '잠시 쉼표를 찍고 숨 고르는 중' }
  ];

  return (
    <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-20">
      
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 mt-2 overflow-hidden shadow-inner">
        <div 
          className="bg-indigo-600 h-full transition-all duration-700 ease-out rounded-full" 
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      <div className="text-center mb-8 animate-fade-in">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight break-keep">
          {step === 2 && '오늘 하루, 어땠나요?'}
          {step === 3 && '지금 가장 무겁게 느껴지는 짐은?'}
          {step === 4 && '당신의 이야기를 들려주세요.'}
        </h3>
        <p className="text-sm text-gray-500">
          {step === 2 && '솔직한 기분을 선택해 주세요'}
          {step === 3 && '가장 큰 고민거리를 골라주세요'}
          {step === 4 && '맞춤형 처방을 위해 필요해요'}
        </p>
      </div>

      {step === 2 && (
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pb-4 scrollbar-hide">
          {emotions.map(({val, icon, text, desc}, idx) => (
            <button 
              key={val}
              onClick={() => handleEmotionSelect(val)}
              className="w-full bg-white border border-[#E8E1D5] hover:border-indigo-500 hover:shadow-md rounded-2xl p-5 transition-all flex flex-col items-center justify-center space-y-3 shadow-sm active:scale-[0.98] group"
              style={{ animation: `slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s both` }}
            >
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{icon}</div>
              <div className="text-gray-900 font-bold text-sm leading-tight">{text}</div>
              <div className="text-gray-500 text-[11px] font-medium break-keep">{desc}</div>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-4 scrollbar-hide">
          {concerns.map(({val, icon, title, desc}, idx) => (
            <button 
              key={val}
              onClick={() => handleConcernSelect(val)}
              className="w-full bg-white border border-[#E8E1D5] hover:border-indigo-500 hover:shadow-md rounded-2xl p-5 transition-all flex items-center space-x-5 text-left shadow-sm active:scale-[0.98] group"
              style={{ animation: `slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s both` }}
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-2xl">
                {icon}
              </div>
              <div className="flex flex-col">
                <span className="text-indigo-600 text-xs font-bold mb-1">{title}</span>
                <span className="text-gray-900 font-medium text-[14px] leading-snug break-keep">{desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-4 scrollbar-hide">
          {states.map(({val, icon, text}, idx) => (
            <button 
              key={val}
              onClick={() => handleStateSelect(val)}
              className="w-full bg-white border border-[#E8E1D5] hover:border-indigo-500 hover:shadow-md rounded-2xl p-5 transition-all text-left flex items-center space-x-5 shadow-sm active:scale-[0.98] group"
              style={{ animation: `slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s both` }}
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                {icon}
              </div>
              <span className="text-gray-900 font-medium text-[15px] leading-snug flex-1 break-keep">{text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
