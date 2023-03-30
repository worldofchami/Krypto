import { Link } from "react-router-dom";

interface ButtonProps {
    text: string;
};

export const PrimaryButton: React.FunctionComponent<ButtonProps> = ({ text }) => {
    return (
        <button className="bg-highlight w-32 h-12">
            {text}
        </button>
    );
};

interface TextProps {
    text: string;
    primary?: boolean;
};

export const SectionHeading: React.FunctionComponent<TextProps> = ({ text, primary }) => {
    const colour = primary ? 'highlight' : 'txt';

    return (
        <h1 className={`font-heading text-xl pl-2 mb-6 mt-6 text-${colour}`}>
            {text}
        </h1>
    )
};

interface CurrencyProps extends TextProps {
    id: string;
};

export const CurrencyPill: React.FunctionComponent<CurrencyProps> = ({ text, id }) => {

    return (
        <Link to={`/coin/${id}`} target="_blank">
            <div className="w-fit sm:h-fit px-2 bg-highlight hover:opacity-75 rounded-full">
                <h1 className="text-baseColour text-[.75rem] sm:text-[.9rem] font-bold">${text}</h1>
            </div>
        </Link>
    );
}