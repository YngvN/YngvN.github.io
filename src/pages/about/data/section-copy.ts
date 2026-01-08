import type { Language } from '../../../types/language';

export const developerIntroCopy: Record<Language, string> = {
    en: 'As a developer I like to try new technology. I am currently practicing Swift in my spare time.',
    no: 'Som utvikler liker jeg å prøve ny teknologi. Øver meg nå på Swift i fritiden.',
};

export const musicianCopy: Record<
    Language,
    {
        intro: string;
    }
> = {
    en: {
        intro: 'I have been interested in music my entire life and have also studied it. That has given me skills across instruments and music tech. I have been on and off stage in larger and smaller projects, founded and led music clubs, produced music, and developed a playfulness that Oslohjelpa called "the best session they had been to in kindergarten."',
    },
    no: {
        intro: 'Jeg har vært interessert musikk i hele livet mit, og har også studert musikk. Da har jeg opparbeidet kompetanse i diverse instrumenter og teknologier. Jeg har vært både på og av scenen i større og mindre prosjekter, stiftet og ledet musikklubber, produsert musikk, og utviklet en lekenhet som i følge Oslohjelpa var "Den beste samlingen de hadde vært på i barnehage".',
    },
};
