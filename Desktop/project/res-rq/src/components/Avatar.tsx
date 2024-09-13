import { Avatar as AV, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Avatar() {
    return (
        <AV className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </AV>
    )
}
