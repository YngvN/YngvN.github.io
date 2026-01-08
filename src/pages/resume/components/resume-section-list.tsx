import './resume-section-list.scss';
import type { ResumeItem } from '../types';

type ResumeSectionListProps = {
    items: ResumeItem[];
};

const ResumeSectionList = ({ items }: ResumeSectionListProps) => (
    <div className="resume-section__list">
        {items.map(({ id, title, institution, start, end, description, skills }) => (
            <article key={id} className="resume-card">
                <div className="resume-card__header">
                    <div className="resume-card__title-group">
                        <div className="resume-card__title">{title}</div>
                        {institution && <div className="resume-card__institution">{institution}</div>}
                    </div>
                    <div className="resume-card__dates">
                        {start} - {end}
                    </div>
                </div>
                {description && <p className="resume-card__description">{description}</p>}
                {skills && (
                    <ul className="resume-card__skills">
                        {skills.map((skill) => (
                            <li key={skill} className="resume-card__skill">
                                {skill}
                            </li>
                        ))}
                    </ul>
                )}
            </article>
        ))}
    </div>
);

export default ResumeSectionList;
