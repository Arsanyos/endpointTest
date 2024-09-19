import { Input as IN } from "@/components/ui/input";

interface InputProps {
    type: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ type, onChange, value }: InputProps) {
    return (
        <IN
            type={type}
            placeholder={value ? value : type}
            onChange={onChange}
            className="bg-gray-100"
        />
    );
}
