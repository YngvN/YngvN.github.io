import './about-hero.scss';

type AboutHeroProps = {
    heading: string;
    subheading: string;
    backgroundImageSrc: string;
    foregroundImageSrc: string;
};

const AboutHero = ({ heading, subheading, backgroundImageSrc, foregroundImageSrc }: AboutHeroProps) => (
    <div className="about-hero-container">
        <div className="about-hero-visual" aria-hidden="true">
            <img className="about-hero-layer about-hero-layer--back" src={backgroundImageSrc} alt="" />
            <img className="about-hero-layer about-hero-layer--front" src={foregroundImageSrc} alt="" />
        </div>
        <div className="about-hero-text">
            <h2 className="hero-name">{heading}</h2>
            <h3 className="page-subheading">{subheading}</h3>
        </div>
    </div>
);

export default AboutHero;
