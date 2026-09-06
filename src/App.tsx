import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { IntroScreen } from './components/IntroScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { MobileResultPage } from './pages/MobileResultPage';
import {
  usePrescription,
  STEP_INTRO,
  STEP_FIRST_QUESTION,
  STEP_LAST_QUESTION,
  STEP_LOADING,
  STEP_RESULT,
} from './hooks/usePrescription';
import type { Answers } from './engine/types';

function KioskFlow() {
  const { step, nextStep, reset, answers, answer, prescription } = usePrescription();

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -15 }
  };

  const pageTransition: any = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  const audioRef = React.useRef<HTMLAudioElement>(null);
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
    }
  }, []);

  return (
    <Layout>
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" 
        autoPlay 
        loop 
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full h-full flex flex-col relative z-20"
        >
          {step === STEP_INTRO && <IntroScreen onNext={nextStep} />}
          {step >= STEP_FIRST_QUESTION && step <= STEP_LAST_QUESTION && (
            <QuestionScreen step={step} onAnswer={answer} />
          )}
          {step === STEP_LOADING && <LoadingScreen onComplete={nextStep} />}
          {step === STEP_RESULT && prescription && (
            <ResultScreen
              prescription={prescription}
              answers={answers as Answers}
              onReset={reset}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      {/* 부스 태블릿 (오프라인) */}
      <Route path="/" element={<KioskFlow />} />
      {/* QR 로 열리는 폰 결과 페이지 — 결과값은 쿼리스트링으로 전달된다 */}
      <Route path="/r" element={<MobileResultPage />} />
    </Routes>
  );
}

export default App;
