import { createContext, Dispatch, SetStateAction, useContext } from "react";
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
};

interface DropDownProps {
    text: string;
    selected: boolean;
    value: string;
};

export const DropDown: React.FunctionComponent<DropDownProps> = ({ text, selected, value }) => {
    const bgColour = selected ? 'highlight' : 'baseColour';
    const textColour = selected ? 'baseColour' : 'txt';

    const modifier = (useContext(ModifierContext) as StateModifier).modifier;

    return (
        <>
            <div
                className={`w-[3rem] h-fit p-1 rounded-full bg-${bgColour} hover:bg-highlight hover:text-baseColour`}
                onClick={({ currentTarget }) => {
                    if(!selected) {
                        modifier(value);
                        ((currentTarget.parentElement as HTMLElement).parentElement as HTMLElement).toggleAttribute('open')
                    }
                }}
            >
                <h1 className={`text-${textColour} text-xs font-bold text-right`}>{text.toUpperCase()}</h1>
            </div>
        </>
    );
};

interface StateModifier {
    modifier: (period: string) => void;
};

const ModifierContext = createContext<StateModifier | null>(null);

interface DropDownContainerProps {
    children?: React.ReactNode[];
    modifier: (period: string) => void;
    text: string;
};

export const DropDownContainer: React.FunctionComponent<DropDownContainerProps> = ({ children, modifier, text }) => {
    children = [
        ...children as React.ReactNode[]
    ];

    return (
        <ModifierContext.Provider value={{ modifier }}>
            <div className="cursor-pointer">
                <details className="w-fit h-max">
                    <summary className="w-[3rem] h-fit p-1 rounded-full bg-highlight text-baseColour justify-end">
                        <h1 className="text-baseColour text-xs font-bold text-right">{text.toUpperCase()}</h1>
                    </summary>
                    <div className="absolute">
                        {children}
                    </div>
                </details>
            </div>
        </ModifierContext.Provider>
    );
};