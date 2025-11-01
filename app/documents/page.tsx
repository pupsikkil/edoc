"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import {
  Plus,
  Download,
  FileCheck,
  Send,
  Archive,
  Trash2,
  Filter,
  Calendar,
  Search,
} from "lucide-react"
import { useState, useEffect } from "react"
import { documentsAPI } from "@/lib/api"

const mockDocuments = [
  {
    id: 1,
    date: "2024-01-15",
    number: "ДОГ-2024-001",
    counterparty: "ООО «Альфа Трейд»",
    type: "Договор",
    amount: "1 250 000",
    currency: "сом",
    status: "Подписан",
    statusVariant: "success" as const,
  },
  {
    id: 2,
    date: "2024-01-14",
    number: "АКТ-2024-045",
    counterparty: "ИП «Батыров С.А.»",
    type: "Акт",
    amount: "45 000",
    currency: "сом",
    status: "На согласовании",
    statusVariant: "warning" as const,
  },
  {
    id: 3,
    date: "2024-01-13",
    number: "СЧ-2024-123",
    counterparty: "ООО «Бета Компани»",
    type: "Счёт",
    amount: "890 000",
    currency: "сом",
    status: "Черновик",
    statusVariant: "outline" as const,
  },
  {
    id: 4,
    date: "2024-01-12",
    number: "СФ-2024-078",
    counterparty: "ООО «Гамма Сервис»",
    type: "Счёт-фактура",
    amount: "2 150 000",
    currency: "сом",
    status: "Отправлен",
    statusVariant: "default" as const,
  },
]

export default function DocumentsPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    loadDocuments()
  }, [filterStatus])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentsAPI.getAll({
        skip: 0,
        limit: 20,
        status: filterStatus !== "all" ? filterStatus : undefined,
      })
      setDocuments(data)
      setError("")
    } catch (err: any) {
      console.error("Ошибка загрузки документов:", err)
      setError("Не удалось загрузить документы")
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const statusFilters = [
    { label: "Все", value: "all" },
    { label: "Входящие", value: "inbox" },
    { label: "Исходящие", value: "sent" },
    { label: "Черновики", value: "draft" },
    { label: "Подписанные", value: "signed" },
    { label: "Архив", value: "archive" },
  ]

  const toggleDocument = (id: number) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map((d) => d.id))
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            {/* Заголовок и действия */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-h1 mb-2">Реестр документов</h1>
                <p className="text-muted-foreground text-body">
                  Управление входящими и исходящими документами
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Создать документ
              </Button>
            </div>

            {/* Фильтры и действия */}
            <Card className="mb-6 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Фильтры:</span>
                </div>
                <div className="flex gap-2">
                  {statusFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={filterStatus === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
                {selectedDocuments.length > 0 && (
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileCheck className="h-4 w-4" />
                      Подписать ({selectedDocuments.length})
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Отправить ({selectedDocuments.length})
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Archive className="h-4 w-4" />
                      Архивировать ({selectedDocuments.length})
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Удалить ({selectedDocuments.length})
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="sm" className="gap-2 ml-auto">
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
              </div>
            </Card>

            {/* Таблица документов */}
            <Card>
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Загрузка документов...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={documents.length > 0 && selectedDocuments.length === documents.length}
                          onChange={toggleAll}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Номер</TableHead>
                      <TableHead>Контрагент</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Нет документов
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((doc) => (
                        <TableRow key={doc.id} className="hover:bg-muted/50">
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(doc.id)}
                              onChange={() => toggleDocument(doc.id)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell className="text-small">
                            {doc.date ? new Date(doc.date).toLocaleDateString('ru-RU') : '-'}
                          </TableCell>
                          <TableCell className="font-medium">{doc.number || doc.id}</TableCell>
                          <TableCell>{doc.receiver_company?.name || '-'}</TableCell>
                          <TableCell>{doc.document_type || '-'}</TableCell>
                          <TableCell className="text-right">
                            {doc.amount ? `${doc.amount} ${doc.currency || 'сом'}` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.status || 'Черновик'}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Search className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>

            {/* Пагинация */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-small text-muted-foreground">
                Показано 1-4 из 124 документов
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Назад
                </Button>
                <Button variant="outline" size="sm">
                  Далее
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


