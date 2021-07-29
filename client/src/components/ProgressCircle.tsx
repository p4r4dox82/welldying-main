import React from 'react';
import { imageUrl } from '../etc/config';

interface Props {
    image: string;
    progress: number;
    message: string;
    title: string;
    color: string;
}

interface State {

}

function ProgressCircle({ image, progress, title, message, color } : Props) {
    let [realProgress, setRealProgress] = React.useState<number>(0);

    React.useEffect(() => {
        if (realProgress >= progress - 0.001) return;

        setTimeout(() => {
            setRealProgress((realProgress * 4 + progress) / 5);
        }, 30);
    }, [realProgress]);

    const imageSize = 130;
    const radius = imageSize/2 + 15, stroke = 10;

    const normalizedRadius = radius - stroke ;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = React.useMemo(() => (1 - (realProgress * 314 / 360) / 100) * circumference, [realProgress]);

    return (
        <div className='progressCircleContainer'>
            <div className='progressCircleMessage'> { message } </div>
            <svg
                height={`${radius * 2}px`}
                width={`${radius * 2}px`}
                className='progressCircleOuter'
            >
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={ stroke }
                    strokeDasharray={ circumference + ' ' + circumference }
                    style={ { strokeDashoffset } }
                    stroke-width={ stroke }
                    r={ normalizedRadius }
                    cx={ radius }
                    cy={ radius }
                />
            </svg>
            <img
                src={imageUrl('checklists/overlay.png')}
                className='progressCircleOverlay'
            />
            <img 
                src={imageUrl(image)} 
                className='link progressCircleInner' 
            />
            <div className='progressCircleTitle'> { title } </div>
        </div>
    );
}

export default ProgressCircle;