"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileX, Edit, Trash2 } from "lucide-react"

const mockDraftDocuments = [
  {
    id: 1,
    date: "2024-01-14",
    number: "Черновик",
    counterparty: "ООО «Бета Компани»",
    type: "Договор",
    amount: "—",
    currency: "",
    lastModified: "2024-01-14 15:30",
  },
]

export default function DraftPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center gap-3">
              <FileX className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-h1 mb-2">Черновики документов</h1>
                <p className="text-muted-foreground text-body">
                  Незавершённые документы
                </p>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Контрагент</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Изменён</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDraftDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="text-small">{doc.date}</TableCell>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{doc.counterparty}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell className="text-small text-muted-foreground">
                        {doc.lastModified}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
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



