import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import policiesData from '../data/policies.json';
import mapoLogo from '../assets/mapo_logo.png';
import type { Policy, UserConcern, UserEmotion } from '../hooks/usePrescription';

const cList: UserConcern[] = ['취업', '주거', '금융', '마음'];
const eList: UserEmotion[] = ['완벽해', '그저 그래', '지쳤어', '우울해'];

export const MobileResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const prescriptionRef = useRef<HTMLDivElement>(null);

  // Decode ID
  const cIdx = id ? parseInt(id.charAt(0)) - 1 : 3;
  const eIdx = id ? parseInt(id.charAt(1)) - 1 : 2;
  
  const userConcern = cList[cIdx] || '마음';
  const userEmotion = eList[eIdx] || '지쳤어';

  // Get matching policies (just pick first two for this concern, similar to hook)
  const policies = policiesData.filter(p => p.tags.includes(userConcern)).slice(0, 2) as Policy[];

  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const getDosageText = (idx: number) => {
    const dosages = ["1일 3회 / 식후 30분", "1일 1회 / 취침 전", "스트레스 받을 때 즉시", "아침 기상 직후 1회"];
    return dosages[idx % dosages.length];
  };

  const getSideEffectText = () => {
    if (userEmotion === '지쳤어') return "부작용: 오늘 밤 치킨 등 야식 폭식이 유발될 수 있음. 무조건 푹 쉴 것!";
    if (userEmotion === '우울해') return "부작용: 갑자기 감수성이 풍부해질 수 있음. 달콤한 디저트로 긴급 처방 권장.";
    if (userEmotion === '완벽해') return "부작용: 과도한 자신감으로 주변이 피곤해질 수 있음. 적당한 릴렉스 요망!";
    return "부작용: 잦은 멍때림이 발생할 수 있음. 오늘은 고민 내려놓고 일찍 잘 것!";
  };

  const handleDownload = async () => {
    if (prescriptionRef.current === null) return;
    try {
      const dataUrl = await toPng(prescriptionRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = '마음약국_약봉투.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  const handleKakaoShare = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '마음약국 처방전 도착! 💌',
          description: `저의 가장 큰 고민은 '${userConcern}'이에요. 약국에서 '${policies[0]?.pill_name || '마음 안정제'}'를 처방받았어요!`,
          imageUrl: 'https://youthrx-result.netlify.app/og-image.png',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '나도 진단받기',
            link: {
              mobileWebUrl: 'https://youthrx-result.netlify.app/',
              webUrl: 'https://youthrx-result.netlify.app/',
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유를 지원하지 않는 환경입니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full">
      <div className="bg-[#FAF8F2] text-gray-900 w-full max-w-md h-full min-h-[100dvh] shadow-xl relative overflow-y-auto flex flex-col sm:rounded-3xl sm:min-h-[800px] sm:h-[800px]">
        
        <div className="p-4 sm:p-6 flex-1 flex flex-col relative z-20 h-full min-h-0">
          <div className="flex-1 pb-6 flex justify-center animate-slide-up">
            
            {/* Authentic Korean Medicine Bag (약봉투) */}
            <div ref={prescriptionRef} className="w-full max-w-[360px] h-fit relative flex flex-col font-sans">
              {/* Folded Flap at the top */}
              <div className="w-full h-8 bg-[#EFE9DF] rounded-t-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-b border-[#D8CFC0] relative z-10 flex items-end px-4 pb-1">
                 <div className="w-full h-[1px] bg-[#D8CFC0] opacity-50"></div>
              </div>

              {/* Main Bag Body */}
              <div className="bg-[#FAF8F2] text-[#111] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-x border-b border-[#E8E1D5] rounded-b-md p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                {/* Header */}
                <div className="text-center mb-8 relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#8B4513] text-[#8B4513] mb-4">
                    <span className="text-2xl font-bold">✚</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#3E3A39] mb-2 font-serif">마음약국</h2>
                  <p className="text-sm text-[#7F8C8D] tracking-wide">당신의 마음을 처방합니다</p>
                </div>

                {/* Patient Info */}
                <div className="flex justify-between items-end border-b-2 border-[#E8E1D5] pb-2 mb-6 px-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#3E3A39]">마포 청년</span>
                    <span className="text-xs text-[#7F8C8D]">귀하</span>
                  </div>
                  <span className="text-xs font-medium text-[#7F8C8D]">{dateStr}</span>
                </div>

                {/* Prescription List */}
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-[#3E3A39] mb-4 px-1">처방 내역</h3>
                  <div className="space-y-3">
                    {policies.map((policy, idx) => (
                        <div key={policy.id} className="block bg-white border border-[#E8E1D5] rounded-2xl p-4 shadow-sm group">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#D35400] flex items-center justify-center text-xl mr-4 shrink-0 font-serif shadow-inner">💊</div>
                            <div className="flex-1">
                              <div className="text-[11px] font-bold text-[#D35400] mb-0.5">{policy.category}</div>
                              <div className="text-[15px] font-bold text-[#3E3A39] leading-tight mb-1">{policy.pill_name}</div>
                              <div className="text-[12px] font-medium text-[#7F8C8D] flex items-center">
                                <span className="mr-1">🕒</span> {getDosageText(idx)}
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div className="mt-6 p-4 bg-[#F0EBE1]/60 rounded-xl border border-[#D8CFC0]">
                  <div className="text-[12px] font-bold text-[#8B4513] mb-1.5 flex items-center">
                    <span className="mr-1.5 text-sm">⚠️</span> 복용 시 주의사항
                  </div>
                  <div className="text-[13px] font-medium text-[#555] leading-relaxed break-keep">
                    {getSideEffectText()}
                  </div>
                </div>

                {/* Comforting Quote */}
                <div className="mt-6 text-center px-2 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-[#D8CFC0] mb-4"></div>
                  <p className="mt-4 text-[13.5px] font-serif text-[#5c5655] leading-relaxed break-keep tracking-tight">
                    {userConcern === '주거' ? "내가 살아가는 곳 하나를 정하는 일도 쉽지 않죠. 앞으로 가야 할 길이 너무 멀게 느껴질 때, 잠시 기대어 쉬어도 괜찮아요." :
                     userConcern === '금융' ? "열심히 살아왔는데도 통장을 보면 마음이 놓이지 않을 때가 있죠. 당신만의 템포로 충분히 잘하고 있으니까요." :
                     userConcern === '취업' ? "남들 다 가는 길이 내 길이 아닐 수도 있죠. 조금 돌아가도 괜찮아요. 시작하기에 늦은 때란 없으니까요." :
                     "아무렇지 않은 척 하루를 보내고 있지만 사실은 많이 지쳐 있었을지도 몰라요. 혼자 다 감당하지 않아도 괜찮아요."}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-dashed border-[#D8CFC0] relative flex items-center justify-center">
                  <img src={mapoLogo} alt="서울청년센터 마포" className="h-7 object-contain opacity-80" />
                  <div className="absolute top-1 right-2 w-12 h-12 border-[2.5px] border-[#E74C3C] rounded-full flex items-center justify-center text-[#E74C3C] text-[11px] font-bold -rotate-[15deg] mix-blend-multiply opacity-80 z-20">
                    조제<br/>완료
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Share Buttons */}
          <div className="flex flex-col space-y-3 mt-auto bg-[#FAF8F2] pt-4 pb-8 sm:pb-2 z-30 relative shrink-0">
            <button 
              onClick={handleDownload}
              className="w-full bg-[#3E3A39] text-white font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-md hover:bg-[#2C2928] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span className="text-base">인스타그램용 이미지 저장</span>
            </button>
            <button 
              onClick={handleKakaoShare}
              className="w-full bg-[#FEE500] text-[#191919] font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm hover:brightness-95 active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-base">카카오톡으로 결과 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
