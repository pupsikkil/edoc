"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Download, TrendingUp, FileText, Users } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-h1 mb-2">Отчёты и аналитика</h1>
                <p className="text-muted-foreground text-body">
                  Статистика и аналитика по документам и активности
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Экспорт отчёта
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-small text-muted-foreground">Всего документов</p>
                      <p className="mt-2 text-3xl font-bold">124</p>
                      <p className="mt-1 text-small text-success">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        +12% за месяц
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-small text-muted-foreground">Подписанных</p>
                      <p className="mt-2 text-3xl font-bold">89</p>
                      <p className="mt-1 text-small text-success">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        +8% за месяц
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                      <BarChart3 className="h-6 w-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-small text-muted-foreground">Контрагентов</p>
                      <p className="mt-2 text-3xl font-bold">24</p>
                      <p className="mt-1 text-small text-success">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        +3 за месяц
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-small text-muted-foreground">Общая сумма</p>
                      <p className="mt-2 text-3xl font-bold">12.5M</p>
                      <p className="mt-1 text-small text-success">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        +1.2M за месяц
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                      <TrendingUp className="h-6 w-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardContent className="p-8">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">Графики и диаграммы</p>
                  <p className="mt-2 text-small text-muted-foreground">
                    Здесь будут графики по документам, активности и контрагентам
                  </p>
                  <p className="mt-4 text-small text-muted-foreground">
                    Интеграция с библиотеками визуализации: Recharts, Chart.js
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}



