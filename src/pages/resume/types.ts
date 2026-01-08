export type ResumeItem = {
    id: string;
    title: string;
    institution?: string;
    start: string;
    end: string;
    description?: string;
    skills?: string[];
};

export type ResumeSection = {
    id: string;
    title: string;
    chosenTitle?: string;
    chosenItemIds?: string[];
    items: ResumeItem[];
};

export type ResumeContent = {
    heading: string;
    subheading: string;
    summary: string;
    softSkillsHeading: string;
    softSkills: string[];
    hardSkillsHeading: string;
    hardSkills: string[];
    sections: ResumeSection[];
};
