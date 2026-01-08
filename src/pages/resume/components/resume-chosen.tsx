import './resume-chosen.scss';
import ResumeSectionList from './resume-section-list';
import type { ResumeItem } from '../types';

type ResumeChosenBlock = {
    id: string;
    chosenTitle: string;
    items: ResumeItem[];
};

type ResumeChosenProps = {
    blocks: ResumeChosenBlock[];
};

const ResumeChosen = ({ blocks }: ResumeChosenProps) => (
    <div className="resume__chosen">
        {blocks.map(({ id, chosenTitle, items }) => (
            <div key={id} className="resume__chosen-block">
                <div className="resume-section__chosen-title">{chosenTitle}</div>
                <ResumeSectionList items={items} />
            </div>
        ))}
    </div>
);

export default ResumeChosen;
