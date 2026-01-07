import React from 'react';
import { IconTagGrid } from '../../../components/icons/icons';
import { creativeItems } from '../../../components/icons/icons-data';

type MusicianContentProps = {
    intro: string;
};

const MusicianContent: React.FC<MusicianContentProps> = ({ intro }) => (
    <div className="musician-content">
        <p>{intro}</p>
        <IconTagGrid items={creativeItems} className="creative-logo-grid" />
    </div>
);

export default MusicianContent;
