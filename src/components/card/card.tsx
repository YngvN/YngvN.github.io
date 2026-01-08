import './card.scss';

type CardProps = {
    title: string;
    subtitle?: string;
    meta?: string;
    description?: string;
    tags?: string[];
    className?: string;
};

const Card = ({ title, subtitle, meta, description, tags, className }: CardProps) => (
    <article className={`card${className ? ` ${className}` : ''}`}>
        <div className="card__header">
            <div className="card__title-group">
                <div className="card__title">{title}</div>
                {subtitle && <div className="card__subtitle">{subtitle}</div>}
            </div>
            {meta && <div className="card__meta">{meta}</div>}
        </div>
        {description && <p className="card__description">{description}</p>}
        {tags && tags.length > 0 ? (
            <ul className="card__tags">
                {tags.map((tag) => (
                    <li key={tag} className="card__tag">
                        {tag}
                    </li>
                ))}
            </ul>
        ) : null}
    </article>
);

export default Card;
