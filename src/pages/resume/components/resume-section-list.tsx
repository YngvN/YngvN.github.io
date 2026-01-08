import './resume-section-list.scss';
import Card from '../../../components/card/card';
import type { ResumeItem } from '../types';

type ResumeSectionListProps = {
    items: ResumeItem[];
};

const ResumeSectionList = ({ items }: ResumeSectionListProps) => (
    <div className="resume-section__list">
        {items.map(({ id, title, institution, start, end, description, skills }) => (
            <Card
                key={id}
                title={title}
                subtitle={institution}
                meta={`${start} - ${end}`}
                description={description}
                tags={skills}
            />
        ))}
    </div>
);

export default ResumeSectionList;
