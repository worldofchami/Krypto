import { useState } from "react";

export const TestSelect = () => {};

interface DropDownContainerProps {
    children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

export const DropDownContainer: React.FunctionComponent<DropDownContainerProps> = ({ children }) => {
    const [period, setPeriod] = useState<any>();
    const enum timePeriods {
        '30MN' = 'm30',
        '1HR' = 'h1',
        '12HR' = 'h12',
    };

    const handleClick = (value: string): void => {
        
    };

    return (
        <>
            <details>
                <summary>

                </summary>
                <DropDownChild text="1D" value="" handleClick={() => handleClick('')} />
                <DropDownChild text="2" value="" handleClick={() => handleClick('')} />
                <DropDownChild text="" value="" handleClick={() => handleClick('')} />
            </details>
        </>
    );
};

interface DropDownChildProps {
    text: string;
    value: string;
    handleClick: (value: string) => void;
}

export const DropDownChild: React.FunctionComponent<DropDownChildProps> = ({ text, value, handleClick }) => {
    return (
        <>
            <div onClick={() => handleClick(value)}>
                <span>{text}</span>
            </div>
        </>
    );
};