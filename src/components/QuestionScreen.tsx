import { useState, useEffect, useRef, useCallback } from 'react';
import useSound from 'use-sound';
import mapoLogo from '../assets/mapo_logo.png';
import { CHAT, QUESTION_ORDER, randomOf } from '../engine/chatScript';
import { STEP_FIRST_QUESTION } from '../hooks/usePrescription';

interface Props {
  step: number;
  onAnswer: (key: string, value: string) => void;
}

type Message = {
  id: string;
  sender: 'pharmacist' | 'user';
  text: string;
};

/**
 * 약사 챗봇 문항 화면.
 *
 * 개인정보를 받지 않으므로 자유 입력창이 없다. 모든 답은 선택지 버튼이며
 * 답한 값은 상위 훅의 메모리에만 머물고 저장·전송하지 않는다.
 */
export const QuestionScreen = ({ step, onAnswer }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepProcessed = useRef<Set<number>>(new Set());

  const [playPop] = useSound('https://actions.google.com/sounds/v1/ui/pop.ogg', { volume: 0.5 });
  const [playReceive] = useSound('https://actions.google.com/sounds/v1/water/water_drip.ogg', { volume: 0.2 });

  const index = step - STEP_FIRST_QUESTION;
  const question = QUESTION_ORDER[index];

  useEffect(() => {
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
        setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'pharmacist', text }]);
        if (triggerOptions) setShowOptions(true);
      }, 1000);
    }, delay);
  }, [playReceive]);

  useEffect(() => {
    // React 18 StrictMode 이중 실행 방지
    if (!question || stepProcessed.current.has(step)) return;
    stepProcessed.current.add(step);

    const prompt = randomOf([...question.prompts]);

    if (index === 0) {
      // 첫 화면 — 이름을 묻지 않고 바로 환영 인사
      const greeting = randomOf(CHAT.greeting);
      greeting.forEach((line, i) => addPharmacistMessage(line, i * 1200));
      addPharmacistMessage(prompt, greeting.length * 1200, true);
    } else {
      addPharmacistMessage(randomOf(CHAT.ack), 300);
      addPharmacistMessage(prompt, 1600, true);
    }
  }, [step, index, question, addPharmacistMessage]);

  const handleSelect = (label: string, emoji: string, value: string | null) => {
    if (!showOptions || !question) return;
    if (navigator.vibrate) navigator.vibrate(50);
    playPop();
    setShowOptions(false);
    setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'user', text: `${emoji} ${label}` }]);
    setTimeout(() => onAnswer(question.key, value as string), 600);
  };

  const total = QUESTION_ORDER.length;

  return (
    <div className="flex-1 flex flex-col relative z-20 h-full min-h-0 bg-[#F7F5F0]">
      {/* 진행 표시 */}
      <div className="shrink-0 px-4 pt-3 md:px-8 md:pt-5">
        <div className="flex items-center gap-1.5 md:max-w-[620px] md:mx-auto">
          {QUESTION_ORDER.map((q, i) => (
            <div
              key={q.key}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i <= index ? 'bg-[#8B4513]' : 'bg-[#E8E1D5]'
              }`}
            />
          ))}
          <span className="ml-2 text-[11px] md:text-xs font-bold text-[#8B7355] tabular-nums shrink-0">
            {Math.min(index + 1, total)} / {total}
          </span>
        </div>
      </div>

      {/* 대화 영역 */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 md:space-y-5 scrollbar-hide ${
          showOptions ? 'pb-[24rem] md:pb-[17rem]' : 'pb-8'
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
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* 선택지 — 자유 입력창 없음 */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E1D5] p-4 md:p-6 transition-transform duration-500 z-30 ${
          showOptions ? 'translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]' : 'translate-y-full'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 max-h-[44vh] overflow-y-auto scrollbar-hide pb-2 md:pb-0 md:max-w-[620px] md:mx-auto">
          {question?.choices.map((c) => (
            <button
              key={c.label}
              onClick={() => handleSelect(c.label, c.emoji, c.value as string | null)}
              className="w-full min-h-[60px] md:min-h-[72px] bg-[#FAF8F2] border border-[#E8E1D5] hover:border-[#8B4513] rounded-xl p-3.5 md:p-4 transition-all flex items-center gap-3 active:scale-[0.98]"
            >
              <div className="bg-white w-9 h-9 md:w-10 md:h-10 rounded-full shadow-sm flex items-center justify-center text-lg md:text-xl shrink-0">
                {c.emoji}
              </div>
              <span className="text-[#3E3A39] font-bold text-[14px] md:text-base flex-1 text-left break-keep">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
