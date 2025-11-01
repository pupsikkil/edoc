"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileEdit, Plus, Download, Trash2 } from "lucide-react"

const mockTemplates = [
  { id: 1, name: "Договор поставки (стандартный)", type: "Договор", lastModified: "2024-01-10" },
  { id: 2, name: "Акт выполненных работ", type: "Акт", lastModified: "2024-01-08" },
  { id: 3, name: "Счёт на оплату (с НДС)", type: "Счёт", lastModified: "2024-01-05" },
  { id: 4, name: "Счёт-фактура", type: "Счёт-фактура", lastModified: "2024-01-03" },
]

export default function TemplatesPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-h1 mb-2">Шаблоны документов</h1>
                <p className="text-muted-foreground text-body">
                  Управление шаблонами документов для быстрого создания
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Создать шаблон
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileEdit className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-small text-muted-foreground">{template.type}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-small text-muted-foreground">
                      Изменён: {template.lastModified}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Download className="h-4 w-4" />
                        Использовать
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



