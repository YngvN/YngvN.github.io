import './resume-skills.scss';

type ResumeSkillsProps = {
    softSkillsHeading: string;
    softSkills: string[];
    hardSkillsHeading: string;
    hardSkills: string[];
};

const ResumeSkills = ({ softSkillsHeading, softSkills, hardSkillsHeading, hardSkills }: ResumeSkillsProps) => (
    <div className="resume__skills">
        <div className="resume__skills-group">
            <h2 className="resume-section__title">{softSkillsHeading}</h2>
            <ul className="resume__skills-list">
                {softSkills.map((skill, idx) => (
                    <li key={idx} className="resume__skill">
                        {skill}
                    </li>
                ))}
            </ul>
        </div>
        <div className="resume__skills-group resume__skills-group--hard">
            <h2 className="resume-section__title">{hardSkillsHeading}</h2>
            <ul className="resume__skills-list">
                {hardSkills.map((skill, idx) => (
                    <li key={idx} className="resume__skill">
                        {skill}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default ResumeSkills;
