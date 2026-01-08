import type { ReactNode } from 'react';
import './about-actions.scss';
import DropdownContainer from '../../../components/icons/containers/dropdown/dropdown-container';
import Arrow from '../../../components/icons/arrow/arrow';
import type { PageName } from '../../../types/pages';
import { categoryDefinitions, type CategoryId } from '../data/about-categories';

type AboutActionsProps = {
    buttons: { label: string; page: PageName; variant: 'primary' | 'secondary' }[];
    onNavigateTo: (page: PageName) => void;
    categoryInfo: Record<CategoryId, { title: string; description: string }>;
    openSections: Record<CategoryId, boolean>;
    onToggleSection: (id: CategoryId) => void;
    renderCategoryContent: (id: CategoryId) => ReactNode;
};

const AboutActions = ({
    buttons,
    onNavigateTo,
    categoryInfo,
    openSections,
    onToggleSection,
    renderCategoryContent,
}: AboutActionsProps) => {
    const hasOpen = categoryDefinitions.some(({ id }) => openSections[id]);

    return (
        <>
            {buttons.length > 0 ? (
                <div className="about-cta">
                    {buttons.map(({ label, page, variant }) => (
                        <button
                            key={page}
                            type="button"
                            className={`btn btn-${variant === 'primary' ? 'primary' : 'secondary'}`}
                            onClick={() => onNavigateTo(page)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            ) : null}
            <DropdownContainer className={hasOpen ? 'dropdown-container--focus' : undefined}>
                {categoryDefinitions.map(({ id }) => {
                    const { title, description } = categoryInfo[id];
                    const isOpen = openSections[id];

                    return (
                        <section
                            key={id}
                            className={`dropdown-panel container${isOpen ? ' open' : ''}`}
                            onClick={() => {
                                if (isOpen) {
                                    onToggleSection(id);
                                }
                            }}
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
                                <div>
                                    <span className="dropdown-title">{title}</span>
                                    <span className="dropdown-description">{description}</span>
                                </div>
                                <Arrow direction="down" open={isOpen} size="sm" className="dropdown-toggle__chevron" />
                            </button>
                            <div
                                id={`${id}-content`}
                                className={`dropdown-content${isOpen ? ' expanded' : ''}`}
                                aria-live="polite"
                            >
                                {renderCategoryContent(id)}
                            </div>
                        </section>
                    );
                })}
            </DropdownContainer>
        </>
    );
};

export default AboutActions;
