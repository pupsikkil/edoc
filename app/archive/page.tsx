"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Archive, Search, Download, FileText } from "lucide-react"
import { useState } from "react"

const mockArchivedDocuments = [
  {
    id: 1,
    date: "2023-12-15",
    number: "ДОГ-2023-125",
    counterparty: "ООО «Альфа Трейд»",
    type: "Договор",
    amount: "500 000",
    currency: "сом",
    archivedDate: "2024-01-01",
  },
  {
    id: 2,
    date: "2023-12-10",
    number: "АКТ-2023-089",
    counterparty: "ИП «Батыров С.А.»",
    type: "Акт",
    amount: "250 000",
    currency: "сом",
    archivedDate: "2024-01-01",
  },
]

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-h1 mb-2">Архив документов</h1>
                <p className="text-muted-foreground text-body">
                  Архивированные документы для долгосрочного хранения
                </p>
              </div>
            </div>

            <Card className="mb-6 p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск в архиве..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт архива
                </Button>
              </div>
            </Card>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата документа</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead>Контрагент</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead>Дата архивации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockArchivedDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="text-small">{doc.date}</TableCell>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{doc.counterparty}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell className="text-right">
                        {doc.amount} {doc.currency}
                      </TableCell>
                      <TableCell className="text-small text-muted-foreground">
                        {doc.archivedDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
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



