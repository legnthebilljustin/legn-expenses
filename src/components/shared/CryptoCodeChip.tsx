import { Chip } from "@nextui-org/react";

type Props = {
    code: string
}

export default function CryptoCodeChip({ code }: Props) {
    return <Chip size="sm" variant="flat" radius="sm" className="mr-1">
        { code }
    </Chip>
}