import React from 'react';
import PropTypes from 'prop-types';
import './skeleton.css';

interface SkeletonProps {
    width: string;
    height: string;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = '20px', className = '' }) => {
    const skeletonStyle: React.CSSProperties = {
        position: 'relative',
        width: width,
        height: height,
        borderRadius: '5px', // Arrondi pour un look plus esthétique
        marginBottom: '10px', // Espacement entre chaque Skeleton
        overflow: 'hidden',
    };

    const highlightStyle: React.CSSProperties = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.6) 55%, rgba(255, 255, 255, 0) 70%)',
        animation: 'shimmer 3s infinite',
    };

    return (
        <div className={`bg-gray-200 ${className}`} style={skeletonStyle}>
            <div style={highlightStyle}></div>
        </div>
    );
};

export default Skeleton;
