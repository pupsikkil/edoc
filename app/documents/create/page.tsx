"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  FileEdit,
  Users,
  CreditCard,
  FileCheck,
  Send,
  X,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const steps = [
  { id: 1, label: "Тип документа", icon: FileText },
  { id: 2, label: "Шаблон", icon: FileEdit },
  { id: 3, label: "Контрагент", icon: Users },
  { id: 4, label: "Реквизиты", icon: CreditCard },
  { id: 5, label: "Редактор", icon: FileEdit },
  { id: 6, label: "Подписание", icon: FileCheck },
  { id: 7, label: "Отправка", icon: Send },
]

const documentTypes = [
  { id: "contract", label: "Договор", icon: FileText },
  { id: "act", label: "Акт", icon: FileText },
  { id: "invoice", label: "Счёт", icon: FileText },
  { id: "invoice-tax", label: "Счёт-фактура", icon: FileText },
  { id: "other", label: "Прочее", icon: FileText },
]

const mockTemplates = [
  { id: 1, name: "Договор поставки (стандартный)", type: "contract" },
  { id: 2, name: "Договор оказания услуг", type: "contract" },
  { id: 3, name: "Акт выполненных работ", type: "act" },
  { id: 4, name: "Счёт на оплату (с НДС)", type: "invoice" },
]

const mockCounterparties = [
  { id: 1, name: "ООО «Альфа Трейд»", inn: "12345678901234" },
  { id: 2, name: "ИП «Батыров С.А.»", inn: "98765432109876" },
  { id: 3, name: "ООО «Бета Компани»", inn: "11112222333344" },
]

export default function CreateDocumentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [selectedCounterparty, setSelectedCounterparty] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    number: "",
    amount: "",
    nds: "",
    currency: "сом",
  })

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedType !== null
      case 2:
        return selectedTemplate !== null
      case 3:
        return selectedCounterparty !== null
      case 4:
        return formData.number !== "" && formData.amount !== ""
      default:
        return true
    }
  }

  const progress = (currentStep / steps.length) * 100

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

            {/* Прогресс-бар */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-h1">Создание документа</h1>
                    <Badge variant="outline">
                      Шаг {currentStep} из {steps.length}
                    </Badge>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Индикаторы шагов */}
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = currentStep > step.id
                    const isCurrent = currentStep === step.id

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                            isCompleted
                              ? "border-primary bg-primary text-primary-foreground"
                              : isCurrent
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted bg-background text-muted-foreground"
                          }`}
                        >
                          {isCompleted && currentStep > step.id ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <p
                          className={`text-xs text-center ${
                            isCurrent ? "font-medium text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Контент шага */}
            <Card>
              <CardContent className="p-6">
                {/* Шаг 1: Выбор типа документа */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="mb-6 text-h2">Выберите тип документа</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {documentTypes.map((type) => {
                        const Icon = type.icon
                        const isSelected = selectedType === type.id
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                            }`}
                          >
                            <Icon className="h-8 w-8 text-primary" />
                            <p className="font-medium">{type.label}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Шаг 2: Выбор шаблона */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="mb-6 text-h2">Выберите шаблон</h2>
                    <div className="space-y-3">
                      {mockTemplates
                        .filter((t) => t.type === selectedType)
                        .map((template) => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                              selectedTemplate === template.id
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                            }`}
                          >
                            <p className="font-medium">{template.name}</p>
                          </button>
                        ))}
                      <button className="w-full rounded-lg border-2 border-dashed border-muted p-4 text-left hover:border-primary/50">
                            <p className="text-muted-foreground">+ Создать новый шаблон</p>
                          </button>
                    </div>
                  </div>
                )}

                {/* Шаг 3: Выбор контрагента */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="mb-6 text-h2">Выберите контрагента</h2>
                    <div className="mb-4">
                      <Input
                        type="search"
                        placeholder="Поиск контрагента..."
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      {mockCounterparties.map((counterparty) => (
                        <button
                          key={counterparty.id}
                          onClick={() => setSelectedCounterparty(counterparty.id)}
                          className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                            selectedCounterparty === counterparty.id
                              ? "border-primary bg-primary/10"
                              : "border-muted hover:border-primary/50"
                          }`}
                        >
                          <p className="font-medium">{counterparty.name}</p>
                          <p className="text-small text-muted-foreground">
                            ИНН: {counterparty.inn}
                          </p>
                        </button>
                      ))}
                      <button className="w-full rounded-lg border-2 border-dashed border-muted p-4 text-left hover:border-primary/50">
                        <p className="text-muted-foreground">+ Создать нового контрагента</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Шаг 4: Заполнение реквизитов */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="mb-6 text-h2">Заполните реквизиты</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Дата документа
                        </label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Номер документа
                        </label>
                        <Input
                          type="text"
                          placeholder="ДОГ-2024-001"
                          value={formData.number}
                          onChange={(e) =>
                            setFormData({ ...formData, number: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Сумма
                        </label>
                        <Input
                          type="number"
                          placeholder="1 250 000"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Валюта
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) =>
                            setFormData({ ...formData, currency: e.target.value })
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="сом">сом</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="RUB">RUB</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-muted p-4">
                      <p className="text-small text-muted-foreground">
                        💡 Реквизиты автоматически заполняются из профиля компании
                      </p>
                    </div>
                  </div>
                )}

                {/* Шаг 5: Редактор */}
                {currentStep === 5 && (
                  <div>
                    <h2 className="mb-6 text-h2">Редактор документа</h2>
                    <div className="rounded-lg border bg-gray-50 p-8" style={{ minHeight: '500px' }}>
                      <div className="text-center">
                        <FileEdit className="mx-auto h-24 w-24 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">
                          OnlyOffice Editor будет здесь
                        </p>
                        <p className="mt-2 text-small text-muted-foreground">
                          Редактирование DOCX прямо в браузере
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Шаг 6: Подписание */}
                {currentStep === 6 && (
                  <div>
                    <h2 className="mb-6 text-h2">Подписание документа</h2>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Предпросмотр документа</p>
                              <p className="text-small text-muted-foreground">
                                {formData.number || "Черновик"}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Просмотреть
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="mb-4 font-medium">Выберите подписантов</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked />
                              <span>Иванов И.И. (Директор)</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" />
                              <span>Петров П.П. (Главный бухгалтер)</span>
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="mb-4 font-medium">Электронная подпись</p>
                          <Button className="w-full gap-2">
                            <FileCheck className="h-4 w-4" />
                            Загрузить сертификат и подписать
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Шаг 7: Отправка */}
                {currentStep === 7 && (
                  <div>
                    <h2 className="mb-6 text-h2">Отправка документа</h2>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="mb-4 font-medium">Получатели</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-lg border p-2">
                              <span>{mockCounterparties.find(c => c.id === selectedCounterparty)?.name}</span>
                              <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button variant="outline" className="w-full">
                              + Добавить получателя
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="mb-4 font-medium">Уведомления</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked />
                              <span>Отправить email-уведомление</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" />
                              <span>Отправить SMS-уведомление</span>
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-primary bg-primary/5">
                        <CardContent className="p-4">
                          <p className="mb-2 font-medium">Готово к отправке!</p>
                          <p className="text-small text-muted-foreground">
                            Проверьте все данные перед отправкой документа
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Кнопки навигации */}
                <div className="mt-8 flex items-center justify-between border-t pt-6">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад
                  </Button>
                  {currentStep < steps.length ? (
                    <Button onClick={nextStep} disabled={!canProceed()}>
                      Далее
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="gap-2">
                      <Send className="h-4 w-4" />
                      Отправить документ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}



