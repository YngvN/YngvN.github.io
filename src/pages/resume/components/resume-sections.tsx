import './resume-sections.scss';
import DropdownContainer from '../../../components/icons/containers/dropdown/dropdown-container';
import Arrow from '../../../components/icons/arrow/arrow';
import ResumeSectionList from './resume-section-list';
import type { ResumeSection } from '../types';

type ResumeSectionsProps = {
    sections: ResumeSection[];
    openSections: Record<string, boolean>;
    onToggleSection: (id: string) => void;
    onSectionClick: (id: string) => void;
};

const ResumeSections = ({ sections, openSections, onToggleSection, onSectionClick }: ResumeSectionsProps) => (
    <DropdownContainer className="resume__sections">
        {sections.map(({ id, title, chosenItemIds, items }) => {
            const isOpen = openSections[id];
            const chosenIds = chosenItemIds ?? [];
            const remainingItems = chosenIds.length > 0 ? items.filter((item) => !chosenIds.includes(item.id)) : items;

            return (
                <section
                    key={id}
                    className={`dropdown-panel resume-section${isOpen ? ' open' : ''}`}
                    onClick={() => onSectionClick(id)}
                >
                    <button
                        type="button"
                        className="dropdown-toggle"
                        onClick={(event) => {
                            event.stopPropagation();
                            onToggleSection(id);
                        }}
                        aria-expanded={isOpen}
                        aria-controls={`${id}-content`}
                    >
                        <span className="dropdown-title resume-section__title">{title}</span>
                        <Arrow direction="down" open={isOpen} size="sm" className="dropdown-toggle__chevron" />
                    </button>
                    <div
                        id={`${id}-content`}
                        className={`dropdown-content${isOpen ? ' expanded' : ''}`}
                        aria-live="polite"
                    >
                        <ResumeSectionList items={remainingItems} />
                    </div>
                </section>
            );
        })}
    </DropdownContainer>
);

export default ResumeSections;
