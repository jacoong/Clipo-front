import Button from '../Button';
import { FcGoogle } from "react-icons/fc";
import PixelBlast from '../PixelBlast';

const JoinAsAdmin = ()=>
{


    const handleLogin = ()=>{
    }
    
    return(
    <>
 
            
            {/* 에러 해결 버튼 */}
            <div className="bg-black border-2 border-[#33B02D] w-[300px] h-[52px] relative rounded-[24px] cursor-pointer overflow-hidden animate-pulse-scale">
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#33B02D"
                    patternScale={2}
                    patternDensity={1.5}
                    pixelSizeJitter={0.3}
                    enableRipples
                    rippleSpeed={0.5}
                    rippleThickness={0.1}
                    rippleIntensityScale={1.2}
                    liquid
                    liquidStrength={0.08}
                    liquidRadius={1.0}
                    liquidWobbleSpeed={4}
                    speed={0.7}
                    edgeFade={0.2}
                    transparent={false}
                    autoPauseOffscreen={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-extrabold text-lg">관리자로 로그인</span>
                </div>
            </div>

    </>
    )
}
export default JoinAsAdmin



