"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ScrollArea } from "@/components/ui/scroll-area"

interface ReceiptImageDialogProps {
    imageUrl: string;
}

export function ReceiptImageDialog({ imageUrl }: ReceiptImageDialogProps) {
    const [loaded, setLoaded] = useState(false);
    return (
        <AlertDialog>
            <AlertDialogTrigger
                onClick={() => setLoaded(false)}
                className={`${buttonVariants({ variant: "secondary" })} mt-2 w-full`}
            >
                <Icons.eye className="mr-2 h-4 w-4" />
                Ver factura
            </AlertDialogTrigger>
            <AlertDialogContent className="flex h-[80vh] flex-col justify-between md:max-w-[480px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {/* {shortenString(numeroFactura)} */}
                        Factura
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <ScrollArea className="h-full rounded-md">
                    {/* <div className="relative bg-slate-600 object-contain flex h-full items-center justify-center"> */}
                    <AspectRatio ratio={9 / 16} className="object-contain flex h-full items-center justify-center">
                        {!loaded && (
                            <div className="flex h-72 items-center justify-center bg-transparent">
                                <Loader2 className="h-12 w-12 animate-spin text-black" />
                            </div>
                        )}
                        <Image
                            className="inset-0 rounded object-fit"
                            src={imageUrl}
                            alt="Imagen de factura"
                            fill
                            onLoad={() => setLoaded(true)}
                        />
                    </AspectRatio>
                    {/* </div> */}
                </ScrollArea>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}