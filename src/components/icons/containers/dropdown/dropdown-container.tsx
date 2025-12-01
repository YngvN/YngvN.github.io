import React from 'react';

import './dropdown-container.scss';

type DropdownContainerProps = {
    className?: string;
    children: React.ReactNode;
};

const DropdownContainer: React.FC<DropdownContainerProps> = ({ className, children }) => (
    <div className={`dropdown-container${className ? ` ${className}` : ''}`}>{children}</div>
);

export default DropdownContainer;
