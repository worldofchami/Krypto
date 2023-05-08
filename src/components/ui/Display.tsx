import React from "react";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import AliasesJSON from '../../aliases.json';
import { TimePeriod } from "../../CoinPage";
// @ts-ignore
import SymbolsJSON from '../../symbols.json';

type IndexableObject = { [index: string]: string };
// TODO: find more efficient way without parsing & stringifying
export const aliases: IndexableObject = JSON.parse(JSON.stringify(AliasesJSON));
export const symbols: IndexableObject = JSON.parse(JSON.stringify(SymbolsJSON));

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
    // TODO: add global variables and remove redeclaring of coinURL
    
    const coinAlias = aliases[id];
    const coinURL =
        coinAlias === 'NONE' ?
        '' :
        `/coin/${coinAlias}`;

    return (
        <Link to={coinURL} target="_blank">
            <div className="w-fit sm:h-fit px-2 bg-highlight hover:opacity-75 rounded-full">
                <h1 className="text-baseColour text-[.75rem] sm:text-[.9rem] font-bold">${text}</h1>
            </div>
        </Link>
    );
};

interface DropDownProps {
    text: string;
    selected: boolean;
    value: TimePeriod;
};

export const DropDown: React.FunctionComponent<DropDownProps> = ({ text, selected, value }) => {
    const bgColour = selected ? 'highlight' : 'baseColour';
    const textColour = selected ? 'baseColour' : 'txt';

    const [stateSelected, setStateSelected] = useState<boolean>(selected);

    const modifier = (useContext(ModifierContext) as StateModifier).modifier;

    return (
        <>
            <div
                className={`w-16 h-fit py-1 px-2 flex items-center justify-between rounded-full bg-${bgColour} hover:bg-highlight hover:text-baseColour`}
                onClick={({ currentTarget }) => {
                    if(!selected) {
                        modifier(value);
                        ((currentTarget.parentElement as HTMLElement).parentElement as HTMLElement).toggleAttribute('open')
                    }
                }}
                onMouseOver={() => setStateSelected(true)}
                onMouseLeave={() => {if(!selected) setStateSelected(false)}}
            >
                <img src={`/public/${stateSelected ? 'arrowDownBase.svg' : 'arrowDownHgt.svg'}`} className="h-2 mr-1" />
                <h1 className={`text-${textColour} text-xs font-bold text-right`}>{text.toUpperCase()}</h1>
            </div>
        </>
    );
};

interface StateModifier {
    modifier: (period: TimePeriod) => void;
};

const ModifierContext = createContext<StateModifier | null>(null);

interface DropDownContainerProps {
    children?: React.ReactNode[];
    modifier: (period: TimePeriod) => void;
    text: string;
};

export const DropDownContainer: React.FunctionComponent<DropDownContainerProps> = ({ children, modifier, text }) => {
    children = [
        ...children as React.ReactNode[]
    ];

    return (
        <ModifierContext.Provider value={{ modifier }}>
            <div className="cursor-pointer">
                <details className="w-16 h-max bg-[#080c08] rounded-sm">
                    <summary className="w-16 h-fit py-1 px-2 rounded-full bg-highlight text-baseColour items-center justify-between">
                        <img src="/public/arrowDownBase.svg" className="h-2 mr-1" />
                        <h1 className="text-baseColour text-xs font-bold text-right">{text.toUpperCase()}</h1>
                    </summary>
                    <div className="absolute bg-[#080c08] rounded-sm">
                        {children}
                    </div>
                </details>
            </div>
        </ModifierContext.Provider>
    );
};