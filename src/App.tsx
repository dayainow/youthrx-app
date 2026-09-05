import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { IntroScreen } from './components/IntroScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { MobileResultPage } from './pages/MobileResultPage';
import { usePrescription } from './hooks/usePrescription';

function KioskFlow() {
  const {
    step,
    nextStep,
    reset,
    userName,
    setUserName,
    userEmotion,
    setUserEmotion,
    userState,
    setUserState,
    userConcern,
    setUserConcern,
    getPrescription,
    prescribedPolicies
  } = usePrescription();

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
          {step === 1 && <IntroScreen onNext={nextStep} />}
          {(step >= 2 && step <= 5) && (
            <QuestionScreen 
              step={step}
              userName={userName}
              setUserName={setUserName}
              userEmotion={userEmotion}
          setUserEmotion={setUserEmotion}
          userState={userState}
          setUserState={setUserState}
          userConcern={userConcern}
          setUserConcern={setUserConcern}
          onNext={nextStep}
          onPrescribe={getPrescription}
        />
      )}
          {step === 6 && <LoadingScreen onComplete={nextStep} />}
          {step === 7 && (
            <ResultScreen 
              policies={prescribedPolicies}
              userEmotion={userEmotion}
              userConcern={userConcern}
              userName={userName}
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
      <Route path="/" element={<KioskFlow />} />
      <Route path="/:id" element={<MobileResultPage />} />
    </Routes>
  );
}

export default App;
