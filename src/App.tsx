import { Dialog } from './components/Dialog';
import { useIdleReset } from './hooks/useIdleReset';
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

function IdleGuard({ onReset }: { onReset: () => void }) {
  const { remaining, keepGoing } = useIdleReset(onReset);
  return (
    <>
      {remaining !== null && <Dialog title="계속 체험하고 계신가요?" onClose={keepGoing}>
        <h2 className="text-xl font-bold mb-4">계속 체험하고 계신가요?</h2>
        <p className="text-sm leading-relaxed mb-5">{remaining}초 후 다음 참여자를 위해 처음 화면으로 돌아가요.</p>
        <button className="enhance-button enhance-primary w-full" onClick={keepGoing}>네, 계속할게요</button>
        <button className="enhance-button w-full mt-3" onClick={onReset}>체험 마치기</button>
      </Dialog>}
    </>
  );
}

function KioskFlow() {
  const { step, nextStep, prevStep, reset, answers, answer, prescription } = usePrescription();

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -15 }
  };

  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration: 0.5
  };

  return (
    <Layout>
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
            <QuestionScreen step={step} answers={answers} onAnswer={answer} onPrevious={prevStep} onReset={reset} />
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
      {step !== STEP_INTRO && <IdleGuard onReset={reset} />}
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
