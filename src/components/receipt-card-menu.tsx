"use client";

import { useState } from "react";
// import type { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { updateReceiptSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
// import { ReceiptFileDialog } from "@/components/receipt-file-dialog";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { trpc } from '@/lib/trpc/client';
import { useQueryClient } from "@tanstack/react-query";

type Inputs = z.infer<typeof updateReceiptSchema>;

interface ReceiptCardMenuProps {
    id: string;
    consecutive: string;
    value: number;
}

export function ReceiptCardMenu({ id, consecutive, value }: ReceiptCardMenuProps) {
    const { toast } = useToast();
    // const { useUploadThing } = generateReactHelpers<OurFileRouter>();
    // const [files, setFiles] = useState<FileWithPreview[] | null>(null);
    // const { isUploading, startUpload } = useUploadThing("productImage");
    const [isUpdating, setIsUpdating] = useState(false);
    const queryClient = useQueryClient();
    const mutation = trpc.receipts.updateReceipt.useMutation({
        onSuccess: () => {
            queryClient.refetchQueries();
        },
    })
    const deleteMutation = trpc.receipts.deleteReceipt.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(['receipts']);
            toast({
                title: 'Factura eliminada exitosamente',
            });
        },

    })

    const form = useForm<Inputs>({
        resolver: zodResolver(updateReceiptSchema),
        defaultValues: {
            id: consecutive,
            value: value.toString(),
        },
    });

    async function onSubmit(data: Inputs) {
        setIsUpdating(true);

        const { id: consecutive, value } = data

        const numberValue = +value;

        try {
            await mutation.mutateAsync({ id, consecutive, value: numberValue })
        } catch (error) {
            toast({
                variant: 'destructive',
                title: `${error}`,
            });
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleDelete() {
        try {
            await deleteMutation.mutateAsync({ id });
        } catch (error) {

            toast({
                variant: 'destructive',
                title: `${error}`,
            });

        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={"icon"}
                    className="absolute top-0 right-0 cursor-pointer rounded-lg hover:bg-transparent"
                >
                    <Icons.dotsHorizontal className="h-5 w-5" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-fit bg-background"
                align="end"
                forceMount
            >
                <AlertDialog>
                    <AlertDialogTrigger className="w-full">
                        <div className="relative flex h-12 cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:h-8">
                            <Icons.edit className="mr-2 h-4 w-4" />
                            <p>Editar datos</p>
                        </div>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="max-w-md">
                        <Form {...form}>
                            <form
                                className="grid gap-4"
                                onSubmit={(...args) =>
                                    void form.handleSubmit(onSubmit)(...args)
                                }
                            >
                                <FormField
                                    control={form.control}
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de factura</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cosmocentro-123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor total</FormLabel>
                                            <FormControl>
                                                <Input placeholder="10000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    variant="secondary"
                                    className="w-fit"
                                    disabled={isUpdating}
                                >
                                    {isUpdating && (
                                        <Icons.spinner
                                            className="mr-2 h-4 w-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                    )}
                                    Guardar cambios
                                    <span className="sr-only">
                                        Guardar los cambios del perfil
                                    </span>
                                </Button>
                            </form>
                        </Form>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cerrar</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* <div className="relative flex h-12  cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:h-8">
                    <ReceiptFileDialog
                        name="image"
                        maxFiles={1}
                        maxSize={1024 * 1024 * 4}
                        files={files}
                        setFiles={setFiles}
                        isUploading={isUploading}
                        disabled={isUpdating}
                    />
                </div> */}
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="group flex h-12 cursor-pointer items-center text-destructive md:h-8"
                >
                    <Icons.trash className="mr-2 h-4 w-4 transition-colors duration-150 group-hover:text-destructive" />
                    <p className="transition-colors duration-150 group-hover:text-destructive">
                        Borrar
                    </p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}