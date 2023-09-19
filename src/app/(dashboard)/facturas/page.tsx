"use client"

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { ReceiptCard } from "@/components/receipt-card";
import { Shell } from "@/components/shell";
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState, useEffect } from 'react';
import { getQueryKey } from '@trpc/react-query';

export default function ReceiptsPage() {

  const { data: session, status } = useSession();
  const email = session?.user?.email as string;
  const { data } = trpc.user.getUserByEmail.useQuery({ email: email }, { enabled: status === 'authenticated' && !!email });

  const [userId, setUserId] = useState("");
  // const { data: receiptData, isLoading } = trpc.receipts.getReceipts.useQuery({ userId: userId }, { enabled: !!userId });

  const { data: receiptData, isLoading: isLoadingReceipts } = trpc.receipts.getReceipts.useQuery({ userId: userId }, { enabled: !!userId });

  useEffect(() => {
    if (data?.id) {
      setUserId(data.id as string);
    }
  }, [data]);

  return (
    <Shell className="mt-2 md:mt-0" variant="sidebar">
      <section className="w-full pt-9">
        <h2 className="mb-6 text-2xl font-semibold ">Mis facturas</h2>
        <div className="flex w-full flex-col gap-6">
          <Card className="w-full">
            <CardHeader className="relative">
              <CardTitle className="tracking-wide">Recordatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Una vez registres tus facturas en la plataforma, estas entrarán
                en etapa de revisión, donde podrán ser aprobadas o rechazadas
                según los criterios de aprobación de facturas de la actividad
              </p>
            </CardContent>
            <Separator className="mb-6" />
            <CardFooter>
              <Link
                className={buttonVariants({ variant: "default" })}
                href="/agregar-factura"
              >
                {receiptData ? "Registra una nueva factura" : "Registra tu primer factura"}
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
          {isLoadingReceipts ? <div>Cargando facturas...</div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(receiptData) && receiptData.map(receipt => (
              <ReceiptCard
                key={receipt.id}
                id={receipt.id}
                imageUrl={receipt.imageUrl}
                state={receipt.state}
                consecutive={receipt.consecutive}
                value={receipt.value}
                userId={receipt.userId}
              />
            ))}
          </div>}
        </div>
      </section>
    </Shell>
  );
}