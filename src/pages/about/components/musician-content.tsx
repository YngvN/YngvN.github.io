import React from 'react';
import type { Language } from '../../../types/language';
import { IconTagGrid, creativeItems } from '../../../components/icons/icons';
import { musicianCopy } from '../data/section-copy';

type MusicianContentProps = {
    language: Language;
};

const MusicianContent: React.FC<MusicianContentProps> = ({ language }) => {
    const { intro } = musicianCopy[language];

    return (
        <div className="musician-content">
            <p>{intro}</p>
            <IconTagGrid items={creativeItems} className="creative-logo-grid" />
        </div>
    );
};

export default MusicianContent;
