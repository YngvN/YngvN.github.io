import type { Language } from '../../../types/language';

export const developerIntroCopy: Record<Language, string> = {
    en: 'As a developer I have worked across frontend and backend through my studies. In electrical engineering the focus was mostly on servers and small programs, while in frontend it was more about design and testing. Swift is something I am experimenting with in my spare time.',
    no: 'Som utvikler har jeg vært innom både frontend og backend, begge relatert til utdanning. På elektroingeniør var det mest fokus på servere og mindre programmer, mens på frontend var det mer design og testing. Swift prøver jeg meg på nå i fritiden.',
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
