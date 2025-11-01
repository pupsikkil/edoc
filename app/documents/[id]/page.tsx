"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileCheck,
  Send,
  Download,
  Printer,
  Archive,
  ArrowLeft,
  FileText,
  Info,
  ShieldCheck,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  Copy,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { DigitalSignature } from "@/components/ui/digital-signature"

const mockDocument = {
  id: 1,
  number: "ДОГ-2024-001",
  date: "2024-01-15",
  counterparty: "ООО «Альфа Трейд»",
  type: "Договор поставки",
  amount: "1 250 000",
  currency: "сом",
  nds: "190 678",
  status: "Подписан",
  statusVariant: "success" as const,
  version: "v1.2",
}

const mockSignatures = [
  {
    id: 1,
    signer: "Иванов Иван Иванович",
    position: "Директор",
    date: "2024-01-15 14:30:25",
    valid: true,
  },
  {
    id: 2,
    signer: "Петров Петр Петрович",
    position: "Главный бухгалтер",
    date: "2024-01-15 15:45:12",
    valid: true,
  },
]

const mockHistory = [
  { id: 1, action: "Создан", user: "Иванов И.И.", date: "2024-01-15 10:00" },
  { id: 2, action: "Изменён", user: "Иванов И.И.", date: "2024-01-15 12:30" },
  { id: 3, action: "Подписан", user: "Иванов И.И.", date: "2024-01-15 14:30" },
  { id: 4, action: "Подписан", user: "Петров П.П.", date: "2024-01-15 15:45" },
  { id: 5, action: "Отправлен", user: "Система", date: "2024-01-15 15:46" },
]

const mockComments = [
  {
    id: 1,
    user: "Петров П.П.",
    text: "Проверено, можно подписывать",
    date: "2024-01-15 14:15",
  },
  {
    id: 2,
    user: "Иванов И.И.",
    text: "@Петров П.П., спасибо за проверку",
    date: "2024-01-15 14:20",
  },
]

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("preview")
  // TODO: Получить реальный URL файла из API
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const tabs = [
    { id: "preview", label: "Просмотр", icon: FileText },
    { id: "metadata", label: "Метаданные", icon: Info },
    { id: "signatures", label: "Подписи", icon: ShieldCheck },
    { id: "history", label: "История", icon: Clock },
    { id: "comments", label: "Комментарии", icon: MessageSquare },
    { id: "related", label: "Связанные документы", icon: LinkIcon },
  ]

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            {/* Навигация назад */}
            <Link href="/documents">
              <Button variant="ghost" size="sm" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад к списку документов
              </Button>
            </Link>

            {/* Верхняя панель с действиями */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h1 className="text-h1">{mockDocument.number}</h1>
                      <Badge variant={mockDocument.statusVariant}>
                        {mockDocument.status}
                      </Badge>
                      <Badge variant="outline">{mockDocument.version}</Badge>
                    </div>
                    <p className="text-muted-foreground text-body">
                      {mockDocument.type} • {mockDocument.counterparty}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <FileCheck className="h-4 w-4" />
                      Подписать
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Send className="h-4 w-4" />
                      Отправить
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Скачать
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Printer className="h-4 w-4" />
                      Распечатать
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Archive className="h-4 w-4" />
                      Архивировать
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <LinkIcon className="h-4 w-4" />
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Вкладки */}
            <Card>
              <div className="border-b">
                <div className="flex gap-1 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Вкладка: Просмотр */}
                {activeTab === "preview" && (
                  <div>
                    <h2 className="mb-4 text-h2">Просмотр документа</h2>
                    {pdfUrl ? (
                      <PDFViewer file={pdfUrl} className="min-h-[600px]" />
                    ) : (
                      <div className="flex items-center justify-center rounded-lg border bg-gray-50 p-8" style={{ minHeight: '600px' }}>
                        <div className="text-center">
                          <FileText className="mx-auto h-24 w-24 text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            PDF документ будет отображён здесь
                          </p>
                          <p className="mt-2 text-small text-muted-foreground">
                            Загрузите файл документа для просмотра
                          </p>
                          {/* TODO: Добавить загрузку файла */}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Вкладка: Метаданные */}
                {activeTab === "metadata" && (
                  <div>
                    <h2 className="mb-4 text-h2">Метаданные документа</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-small text-muted-foreground">Номер</p>
                        <p className="text-body font-medium">{mockDocument.number}</p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">Дата</p>
                        <p className="text-body font-medium">{mockDocument.date}</p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">Контрагент</p>
                        <p className="text-body font-medium">{mockDocument.counterparty}</p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">Тип документа</p>
                        <p className="text-body font-medium">{mockDocument.type}</p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">Сумма</p>
                        <p className="text-body font-medium">
                          {mockDocument.amount} {mockDocument.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">НДС</p>
                        <p className="text-body font-medium">{mockDocument.nds} {mockDocument.currency}</p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">Валюта</p>
                        <p className="text-body font-medium">{mockDocument.currency}</p>
                      </div>
                      <div>
                        <p className="text-small text-muted-foreground">Версия</p>
                        <p className="text-body font-medium">{mockDocument.version}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Вкладка: Подписи */}
                {activeTab === "signatures" && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-h2">Электронные подписи</h2>
                      <DigitalSignature
                        documentId={parseInt(params.id)}
                        onSignComplete={(signature) => {
                          console.log("Документ подписан:", signature)
                          // TODO: Обновить список подписей
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                      {mockSignatures.map((signature) => (
                        <Card key={signature.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{signature.signer}</p>
                                <p className="text-small text-muted-foreground">
                                  {signature.position}
                                </p>
                                <p className="mt-2 text-small text-muted-foreground">
                                  {signature.date}
                                </p>
                              </div>
                              <Badge variant={signature.valid ? "success" : "destructive"}>
                                {signature.valid ? "Валидна" : "Невалидна"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Вкладка: История */}
                {activeTab === "history" && (
                  <div>
                    <h2 className="mb-4 text-h2">История изменений</h2>
                    <div className="relative">
                      <div className="absolute left-4 top-0 h-full w-0.5 bg-border"></div>
                      <div className="space-y-6">
                        {mockHistory.map((item, index) => (
                          <div key={item.id} className="relative flex gap-4">
                            <div className="z-10 h-8 w-8 rounded-full bg-primary"></div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{item.action}</p>
                                <p className="text-small text-muted-foreground">
                                  {item.date}
                                </p>
                              </div>
                              <p className="mt-1 text-small text-muted-foreground">
                                {item.user}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Вкладка: Комментарии */}
                {activeTab === "comments" && (
                  <div>
                    <h2 className="mb-4 text-h2">Комментарии</h2>
                    <div className="space-y-4">
                      {mockComments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium">{comment.user}</p>
                              <p className="text-small text-muted-foreground">
                                {comment.date}
                              </p>
                            </div>
                            <p className="text-body">{comment.text}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Написать комментарий..."
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <Button>Отправить</Button>
                    </div>
                  </div>
                )}

                {/* Вкладка: Связанные документы */}
                {activeTab === "related" && (
                  <div>
                    <h2 className="mb-4 text-h2">Связанные документы</h2>
                    <div className="space-y-2">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">АКТ-2024-045</p>
                              <p className="text-small text-muted-foreground">Акт выполненных работ</p>
                            </div>
                            <Badge variant="outline">Связан</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">СЧ-2024-123</p>
                              <p className="text-small text-muted-foreground">Счёт</p>
                            </div>
                            <Badge variant="outline">Связан</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

