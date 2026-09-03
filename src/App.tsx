import { Layout } from './components/Layout';
import { IntroScreen } from './components/IntroScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { usePrescription } from './hooks/usePrescription';

function App() {
  const {
    step,
    nextStep,
    reset,
    userEmotion,
    setUserEmotion,
    userState,
    setUserState,
    userConcern,
    setUserConcern,
    getPrescription,
    prescribedPolicies
  } = usePrescription();

  return (
    <Layout>
      {step === 1 && (
        <IntroScreen onNext={nextStep} />
      )}
      {(step >= 2 && step <= 4) && (
        <QuestionScreen 
          step={step}
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
      {step === 5 && (
        <LoadingScreen onComplete={nextStep} />
      )}
      {step === 6 && (
        <ResultScreen 
          policies={prescribedPolicies}
          userEmotion={userEmotion}
          userConcern={userConcern}
          onReset={reset}
        />
      )}
    </Layout>
  );
}

export default App;
