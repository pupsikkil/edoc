"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Mail, Phone, Building2, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useState } from "react"

const mockPartners = [
  {
    id: 1,
    name: "ООО «Альфа Трейд»",
    inn: "12345678901234",
    status: "Подключён",
    statusVariant: "success" as const,
    email: "info@alpha-trade.kg",
    phone: "+996 555 123456",
    documents: 45,
  },
  {
    id: 2,
    name: "ИП «Батыров С.А.»",
    inn: "98765432109876",
    status: "Приглашён",
    statusVariant: "warning" as const,
    email: "batyrov@example.kg",
    phone: "+996 555 654321",
    documents: 12,
  },
  {
    id: 3,
    name: "ООО «Бета Компани»",
    inn: "11112222333344",
    status: "Не подключён",
    statusVariant: "outline" as const,
    email: "info@beta-company.kg",
    phone: "+996 555 789012",
    documents: 0,
  },
  {
    id: 4,
    name: "ООО «Гамма Сервис»",
    inn: "55556666777788",
    status: "Подключён",
    statusVariant: "success" as const,
    email: "contact@gamma-service.kg",
    phone: "+996 555 345678",
    documents: 89,
  },
]

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const statusFilters = [
    { label: "Все", value: "all" },
    { label: "Подключён", value: "connected" },
    { label: "Приглашён", value: "invited" },
    { label: "Не подключён", value: "not-connected" },
  ]

  const filteredPartners = mockPartners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.inn.includes(searchQuery) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "connected" && partner.status === "Подключён") ||
      (filterStatus === "invited" && partner.status === "Приглашён") ||
      (filterStatus === "not-connected" && partner.status === "Не подключён")

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Подключён":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "Приглашён":
        return <Clock className="h-4 w-4 text-warning" />
      case "Не подключён":
        return <XCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return null
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
                <h1 className="text-h1 mb-2">Контрагенты</h1>
                <p className="text-muted-foreground text-body">
                  Управление списком контрагентов и роумингом
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить контрагента
              </Button>
            </div>

            {/* Фильтры и поиск */}
            <Card className="mb-6 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск по названию, ИНН, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
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
              </div>
            </Card>

            {/* Таблица контрагентов */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Контрагент</TableHead>
                    <TableHead>ИНН</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Статус роуминга</TableHead>
                    <TableHead className="text-right">Документов</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">Контрагенты не найдены</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartners.map((partner) => (
                      <TableRow key={partner.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{partner.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-small">
                          {partner.inn}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-small">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {partner.email}
                            </div>
                            <div className="flex items-center gap-2 text-small">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {partner.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(partner.status)}
                            <Badge variant={partner.statusVariant}>{partner.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="font-medium">{partner.documents}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              Просмотреть
                            </Button>
                            {partner.status === "Не подключён" && (
                              <Button variant="outline" size="sm">
                                <Mail className="mr-2 h-4 w-4" />
                                Пригласить
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Статистика */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-small text-muted-foreground">Всего контрагентов</p>
                  <p className="mt-2 text-2xl font-bold">{mockPartners.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-small text-muted-foreground">Подключённых</p>
                  <p className="mt-2 text-2xl font-bold text-success">
                    {mockPartners.filter((p) => p.status === "Подключён").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-small text-muted-foreground">Приглашённых</p>
                  <p className="mt-2 text-2xl font-bold text-warning">
                    {mockPartners.filter((p) => p.status === "Приглашён").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-small text-muted-foreground">Всего документов</p>
                  <p className="mt-2 text-2xl font-bold">
                    {mockPartners.reduce((sum, p) => sum + p.documents, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



