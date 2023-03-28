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
    primary: boolean;
};

export const SectionHeading: React.FunctionComponent<TextProps> = ({ text, primary }) => {
    const colour = primary ? 'highlight' : 'txt';

    return (
        <h1 className={`font-heading text-xl pl-2 mb-6 mt-6 text-${colour}`}>
            {text}
        </h1>
    )
};