import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ReceiptCardMenu } from "@/components/receipt-card-menu";
import { ReceiptImageDialog } from "@/components/receipt-image-dialog";

interface ReceiptCardProps {
    id: string;
    imageUrl: string;
    state: string;
    consecutive: string;
    value: number;
    userId: string;
}

export function ReceiptCard({ id, imageUrl, state, consecutive, value, userId }: ReceiptCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="relative">
                <ReceiptCardMenu id={id} consecutive={consecutive} value={value} />
                <CardTitle className="font text-sm font-medium tracking-wide">
                    {consecutive}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                    <p className="text-sm text-[#B8B8B8]">{state}</p>
                </div>
            </CardContent>
            <CardFooter>
                <ReceiptImageDialog imageUrl={imageUrl} />
            </CardFooter>
        </Card>
    );
}