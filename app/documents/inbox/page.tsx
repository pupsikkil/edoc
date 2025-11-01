"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Inbox } from "lucide-react"

const mockInboxDocuments = [
  {
    id: 1,
    date: "2024-01-15",
    number: "ДОГ-2024-001",
    counterparty: "ООО «Альфа Трейд»",
    type: "Договор",
    amount: "1 250 000",
    currency: "сом",
    status: "Требует подписи",
    statusVariant: "warning" as const,
  },
]

export default function InboxPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center gap-3">
              <Inbox className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-h1 mb-2">Входящие документы</h1>
                <p className="text-muted-foreground text-body">
                  Документы, требующие вашего внимания
                </p>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead>Отправитель</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInboxDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="text-small">{doc.date}</TableCell>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{doc.counterparty}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell className="text-right">
                        {doc.amount} {doc.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.statusVariant}>{doc.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">—</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}



